"use client";

import React from "react";
import { Search, Bell } from "lucide-react";
import styles from "@/styles/StudentDashboard.module.css";

interface GreetingHeaderProps {
  name: string;
  avatar?: string;
}

export default function GreetingHeader({ name, avatar }: GreetingHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header className={styles.header}>
      <div className={styles.welcomeInfo}>
        <h1 className={styles.greetingText}>
          {getGreeting()}, {name}! 👋
        </h1>
        <p className={styles.subText}>
          Ready to conquer your learning goals today?
        </p>
      </div>
      
      <div className={styles.headerActions}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input type="text" placeholder="Search lessons, docs..." />
        </div>
        <button className={styles.notifBadge}>
          <Bell size={20} />
        </button>
        <img src={avatar} className={styles.profileImg} alt={name} />
      </div>
    </header>
  );
}
