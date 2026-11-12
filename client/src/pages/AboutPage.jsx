import React from 'react';

export default function AboutPage() {
  return (
    <section className="page-frame">
      <div className="page-heading">
        <span className="eyebrow">ACADEMIC MINOR PROJECT – I</span>
        <h1>Sahayata – Smart Help for Every Home</h1>
        <p>
          Submitted in partial fulfillment of the requirements for Master of Computer Applications (MCA).
        </p>
      </div>

      <div className="panel" style={{ maxWidth: '950px', margin: '0 auto 28px', borderLeft: '4px solid #f63360' }}>
        <h3 style={{ margin: '0 0 10px' }}>Project Synopsis Credentials</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', fontSize: '12px' }}>
          <div><strong>Student Name:</strong> TEJSI</div>
          <div><strong>Enrollment No:</strong> 03814004426</div>
          <div><strong>Course / Semester:</strong> MCA I (Shift – I)</div>
          <div><strong>Department:</strong> Department of Information Technology</div>
          <div><strong>Institution:</strong> Jagan Institute of Management Studies (JIMS), Rohini</div>
          <div><strong>Affiliation:</strong> Guru Gobind Singh Indraprastha University (GGSIPU)</div>
        </div>
      </div>

      <div className="about-grid">
        <div className="about-illustration">
          🏡<span>♡</span>
        </div>

        <div className="about-copy">
          <h2>Bridging Households & Domestic Workers</h2>
          <p>
            Domestic workers provide essential home services such as house cleaning, cooking,
            laundry, dishwashing, grocery assistance, and elderly care. Traditionally, these services
            are arranged through informal phone calls or references, leading to scheduling conflicts,
            unclear attendance, and lack of replacement options.
          </p>
          <p>
            <strong>Sahayata</strong> introduces a centralized digital platform with an intelligent
            rule-based matching algorithm that evaluates worker availability, skills, proximity,
            workload, and historical rating. It also incorporates automatic replacement after cancellations
            and recorded attendance timestamps.
          </p>

          <div className="pills">
            <span className="pill green-pill">✓ Rule-Based Smart Allocation</span>
            <span className="pill green-pill">✓ Conflict-Free Slot Scheduling</span>
            <span className="pill green-pill">✓ Attendance Check-In / Check-Out</span>
            <span className="pill green-pill">✓ Automated Replacement Engine</span>
          </div>
        </div>
      </div>
    </section>
  );
}
