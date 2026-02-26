"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  BarChart,
  PieChart,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import styles from "@/styles/Attendance.module.css";
import { attendanceService } from "@/services/attendance.services";
import {  AttendanceSummary, MonthlyAttendance, AttendanceRecord, dashboardService } from "@/services/dashboard.services";
import toast from "react-hot-toast";

export default function AttendancePage() {
  const [loading, setLoading] = useState(true);
  const [summaries, setSummaries] = useState<AttendanceSummary[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyAttendance[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedCourse, setSelectedCourse] = useState<number | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedMonth, selectedYear]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const [summaryData, monthlyData] = await Promise.all([
        attendanceService.getAttendanceSummary(),
        attendanceService.getMonthlyAttendance(selectedMonth, selectedYear),
      ]);
      setSummaries(summaryData);
      setMonthlyData(monthlyData);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  const overallAttendance = summaries.length > 0
    ? summaries.reduce((acc, curr) => acc + curr.attendancePercentage, 0) / summaries.length
    : 0;

  const totalClasses = summaries.reduce((acc, curr) => acc + curr.totalClasses, 0);
  const totalPresent = summaries.reduce((acc, curr) => acc + curr.presentCount, 0);
  const totalAbsent = summaries.reduce((acc, curr) => acc + curr.absentCount, 0);
  const totalLate = summaries.reduce((acc, curr) => acc + curr.lateCount, 0);

  const filteredRecords = monthlyData.flatMap(m => m.records).filter(record => 
    selectedCourse === "all" || record.courseId === selectedCourse
  );

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'present': return <CheckCircle size={16} className={styles.statusPresent} />;
      case 'absent': return <XCircle size={16} className={styles.statusAbsent} />;
      case 'late': return <Clock size={16} className={styles.statusLate} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'present': return 'Present';
      case 'absent': return 'Absent';
      case 'late': return 'Late';
      default: return status;
    }
  };

  const downloadReport = () => {
    // Create CSV content
    const headers = ['Course', 'Date', 'Status', 'Check In', 'Check Out'];
    const rows = filteredRecords.map(r => [
      r.courseName,
      new Date(r.date).toLocaleDateString(),
      r.status,
      r.checkInTime || '-',
      r.checkOutTime || '-'
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-${selectedMonth}-${selectedYear}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success("Report downloaded successfully!");
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Loading attendance data...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Attendance Dashboard</h1>
          <p className={styles.subtitle}>Track your attendance across all courses</p>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.filterBtn}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filters
          </button>
          <button 
            className={styles.downloadBtn}
            onClick={downloadReport}
          >
            <Download size={18} />
            Download Report
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            className={styles.filtersPanel}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.filtersContent}>
              <div className={styles.filterGroup}>
                <label>Month</label>
                <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className={styles.select}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Year</label>
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className={styles.select}
                >
                  {[2023, 2024, 2025].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>Course</label>
                <select 
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value === "all" ? "all" : parseInt(e.target.value))}
                  className={styles.select}
                >
                  <option value="all">All Courses</option>
                  {summaries.map(course => (
                    <option key={course.courseId} value={course.courseId}>
                      {course.courseName}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label>View Mode</label>
                <div className={styles.viewToggle}>
                  <button 
                    className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <BarChart size={16} />
                    Grid
                  </button>
                  <button 
                    className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <PieChart size={16} />
                    List
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Overview */}
      <motion.div 
        className={styles.statsGrid}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#FACC1515', color: '#FACC15' }}>
            <TrendingUp size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Overall Attendance</span>
            <span className={styles.statValue}>{overallAttendance.toFixed(1)}%</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#10B98115', color: '#10B981' }}>
            <CheckCircle size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Present</span>
            <span className={styles.statValue}>{totalPresent}/{totalClasses}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#EF444415', color: '#EF4444' }}>
            <XCircle size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Absent</span>
            <span className={styles.statValue}>{totalAbsent}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#F59E0B15', color: '#F59E0B' }}>
            <Clock size={24} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Late</span>
            <span className={styles.statValue}>{totalLate}</span>
          </div>
        </div>
      </motion.div>

      {/* Course-wise Summary */}
      <motion.div 
        className={styles.coursesSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className={styles.sectionTitle}>Course-wise Attendance</h2>
        <div className={styles.coursesGrid}>
          {summaries.map((course, index) => (
            <motion.div 
              key={course.courseId}
              className={styles.courseCard}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className={styles.courseHeader}>
                <BookOpen size={20} className={styles.courseIcon} />
                <h3>{course.courseName}</h3>
              </div>
              
              <div className={styles.courseStats}>
                <div className={styles.courseStat}>
                  <span className={styles.statLabel}>Total Classes</span>
                  <span className={styles.statNumber}>{course.totalClasses}</span>
                </div>
                <div className={styles.courseStat}>
                  <span className={styles.statLabel}>Present</span>
                  <span className={styles.statNumber} style={{ color: '#10B981' }}>{course.presentCount}</span>
                </div>
                <div className={styles.courseStat}>
                  <span className={styles.statLabel}>Absent</span>
                  <span className={styles.statNumber} style={{ color: '#EF4444' }}>{course.absentCount}</span>
                </div>
                <div className={styles.courseStat}>
                  <span className={styles.statLabel}>Late</span>
                  <span className={styles.statNumber} style={{ color: '#F59E0B' }}>{course.lateCount}</span>
                </div>
              </div>

              <div className={styles.progressSection}>
                <div className={styles.progressHeader}>
                  <span>Attendance</span>
                  <span className={styles.progressPercentage}>{course.attendancePercentage}%</span>
                </div>
                <div className={styles.progressBar}>
                  <motion.div 
                    className={styles.progressFill}
                    initial={{ width: 0 }}
                    animate={{ width: `${course.attendancePercentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    style={{ backgroundColor: course.attendancePercentage >= 75 ? '#10B981' : '#F59E0B' }}
                  />
                </div>
              </div>

              <div className={styles.statusTag} style={{
                background: course.attendancePercentage >= 75 ? '#10B98115' : '#F59E0B15',
                color: course.attendancePercentage >= 75 ? '#10B981' : '#F59E0B'
              }}>
                {course.attendancePercentage >= 75 ? 'Good Standing' : 'Needs Improvement'}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Monthly Records */}
      <motion.div 
        className={styles.recordsSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Attendance Records - {monthlyData[0]?.month} {selectedYear}
          </h2>
          <div className={styles.monthNavigation}>
            <button 
              className={styles.navBtn}
              onClick={() => {
                if (selectedMonth === 1) {
                  setSelectedMonth(12);
                  setSelectedYear(prev => prev - 1);
                } else {
                  setSelectedMonth(prev => prev - 1);
                }
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <span className={styles.currentMonth}>
              {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })} {selectedYear}
            </span>
            <button 
              className={styles.navBtn}
              onClick={() => {
                if (selectedMonth === 12) {
                  setSelectedMonth(1);
                  setSelectedYear(prev => prev + 1);
                } else {
                  setSelectedMonth(prev => prev + 1);
                }
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className={styles.recordsGrid}>
            {filteredRecords.map((record, index) => (
              <motion.div 
                key={record.id}
                className={styles.recordCard}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -2 }}
              >
                <div className={styles.recordHeader}>
                  <span className={styles.recordDate}>
                    {new Date(record.date).toLocaleDateString('default', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </span>
                  <span className={`${styles.recordStatus} ${styles[record.status]}`}>
                    {getStatusIcon(record.status)}
                    {getStatusText(record.status)}
                  </span>
                </div>
                <h4 className={styles.recordCourse}>{record.courseName}</h4>
                {(record.checkInTime || record.checkOutTime) && (
                  <div className={styles.recordTime}>
                    <Clock size={14} />
                    <span>
                      {record.checkInTime || '--'} - {record.checkOutTime || '--'}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.recordsTable}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, index) => (
                  <motion.tr 
                    key={record.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                  >
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{record.courseName}</td>
                    <td>
                      <span className={`${styles.tableStatus} ${styles[record.status]}`}>
                        {getStatusIcon(record.status)}
                        {getStatusText(record.status)}
                      </span>
                    </td>
                    <td>{record.checkInTime || '-'}</td>
                    <td>{record.checkOutTime || '-'}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredRecords.length === 0 && (
          <div className={styles.emptyState}>
            <Calendar size={48} />
            <h3>No Records Found</h3>
            <p>There are no attendance records for the selected filters.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}