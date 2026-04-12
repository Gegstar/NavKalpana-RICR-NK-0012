"use client";

import React from "react";
import { Briefcase, Building, MapPin, Globe, ArrowRight } from "lucide-react";
import styles from "@/styles/StudentDashboard.module.css";

interface Job {
  id: number;
  title: string;
  company?: { name: string };
  location?: string;
  type?: string;
  salary?: string;
}

interface JobBoardProps {
  jobs: Job[];
}

export default function JobBoard({ jobs }: JobBoardProps) {
  return (
    <section className={styles.jobSection}>
      <div className={styles.sectionTitle}>
        <Briefcase size={24} color="var(--color-primary)" />
        <h2>Opportunities for You</h2>
      </div>

      <div className={styles.jobGrid}>
        {jobs.length > 0 ? (
          jobs.slice(0, 3).map((job) => (
            <div key={job.id} className={styles.jobCard}>
              <div className={styles.jobHeader}>
                <div className={styles.companyBadge}>
                  <Building size={20} />
                </div>
                <span className={styles.jobTypeTag}>
                  {job.type || "Full-time"}
                </span>
              </div>

              <div className={styles.jobBody}>
                <h4>{job.title}</h4>
                <p>
                  <MapPin size={14} />
                  {job.location || "Remote"}
                </p>
                <p style={{ marginTop: '0.25rem' }}>
                  <Globe size={14} />
                  {job.company?.name || "Tech Solutions"}
                </p>
              </div>

              <div className={styles.jobFooter}>
                <span className={styles.salary}>{job.salary || "$45k - $60k"}</span>
                <button className={styles.applyBtn}>Quick Apply</button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', width: '100%' }}>
            Stay tuned! New opportunities are coming your way.
          </div>
        )}
      </div>

      <div className={styles.sectionFooter}>
        <button className={styles.loadMoreBtn}>
          Explore All Opportunities
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
