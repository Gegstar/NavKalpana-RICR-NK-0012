"use client";

import React from "react";
import { Users, UserPlus, GraduationCap } from "lucide-react";
import styles from "@/styles/StudentDashboard.module.css";

interface Alumni {
  id: number;
  name: string;
  position?: string;
  batch?: string;
  avatar?: string;
}

interface AlumniNetworkProps {
  alumni: Alumni[];
}

export default function AlumniNetwork({ alumni }: AlumniNetworkProps) {
  return (
    <section className={styles.alumniSection}>
      <div className={styles.sectionTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Users size={24} color="var(--primary-yellow)" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Notable Alumni</h2>
      </div>

      <div className={styles.alumniContainer}>
        {alumni.length > 0 ? (
          alumni.slice(0, 5).map((person) => (
            <div key={person.id} className={styles.alumniCard}>
              <img 
                src={person.avatar} 
                className={styles.alumniAvatar} 
                alt={person.name} 
              />
              <h4>{person.name}</h4>
              <p className={styles.role}>{person.position}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <GraduationCap size={12} color="var(--text-secondary)" />
                <span className={styles.batch}>Class of {person.batch}</span>
              </div>

              <button className={styles.connectBtn}>
                <UserPlus size={14} />
                Connect
              </button>
            </div>
          ))
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', width: '100%' }}>
            Your network is growing. Check back soon.
          </div>
        )}
      </div>
    </section>
  );
}
