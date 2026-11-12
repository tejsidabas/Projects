export function parseTimeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + (minutes || 0);
}

export function hasTimeConflict(slotA, slotB) {
  const startA = parseTimeToMinutes(slotA.time);
  // Calculates end time based on booking duration in hours
  const endA = startA + (Number(slotA.duration) || 2) * 60;

  const startB = parseTimeToMinutes(slotB.time);
  const endB = startB + (Number(slotB.duration) || 2) * 60;

  // Two time slots overlap if one starts before the other ends
  return Math.max(startA, startB) < Math.min(endA, endB);
}

export function hasBookingConflict(helperId, date, time, duration, existingBookings, excludeBookingId = null) {
  const requestedSlot = { time, duration };

  return existingBookings.some((booking) => {
    if (booking.id === excludeBookingId) return false;
    if (booking.helperId !== helperId) return false;
    if (booking.date !== date) return false;
    if (booking.status === 'Cancelled') return false;

    return hasTimeConflict(requestedSlot, { time: booking.time, duration: booking.duration });
  });
}

export function calculateSuitabilityScore(helper, requestedService, requestedAddress, bookingDate, existingBookings) {
  // 1. Rating component: 30% weight normalized against 5-star maximum
  const ratingScore = ((Number(helper.rating) || 4.5) / 5) * 30;

  // 2. Experience component: 25% weight capped at 10 years
  const experienceYears = Number(helper.experience) || 1;
  const experienceScore = Math.min(experienceYears / 10, 1) * 25;

  // 3. Location proximity component: 25% weight based on locality matching
  let locationScore = 10;
  const helperArea = (helper.area || '').toLowerCase();
  const address = (requestedAddress || '').toLowerCase();
  if (helperArea && address) {
    if (address.includes(helperArea) || helperArea.includes(address.split(',')[0].trim())) {
      locationScore = 25;
    } else {
      locationScore = 15;
    }
  }

  // 4. Workload balance component: 20% weight prioritizing helpers with fewer bookings on the target date
  const activeBookingsToday = existingBookings.filter(
    (b) => b.helperId === helper.id && b.date === bookingDate && b.status !== 'Cancelled'
  ).length;
  // Decreases score progressively as existing workload on that day increases
  const workloadScore = Math.max(0, 20 - activeBookingsToday * 7);

  const totalScore = Math.round(ratingScore + experienceScore + locationScore + workloadScore);

  return {
    totalScore,
    breakdown: {
      ratingScore: Math.round(ratingScore),
      experienceScore: Math.round(experienceScore),
      locationScore: Math.round(locationScore),
      workloadScore: Math.round(workloadScore),
      activeBookingsToday
    }
  };
}

export function rankHelpersForBooking({ helpers, serviceName, date, time, duration = 2, address, existingBookings, excludeHelperIds = [] }) {
  // Filter candidates by required skill, active availability, and exclusion list
  const eligible = helpers.filter((helper) => {
    if (excludeHelperIds.includes(helper.id)) return false;
    if (helper.available === false) return false;

    const hasSkill = Array.isArray(helper.skills) && helper.skills.some(
      (s) => s.toLowerCase() === serviceName.toLowerCase()
    );
    if (!hasSkill) return false;

    const hasConflict = hasBookingConflict(helper.id, date, time, duration, existingBookings);
    return !hasConflict;
  });

  return eligible
    .map((helper) => {
      const match = calculateSuitabilityScore(helper, serviceName, address, date, existingBookings);
      return {
        ...helper,
        matchScore: match.totalScore,
        matchBreakdown: match.breakdown
      };
    })
    // Sort in descending order of calculated suitability score
    .sort((a, b) => b.matchScore - a.matchScore);
}
