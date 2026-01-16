"use client";

import styles from "./task-master.module.css";
import TaskMasterShell from "./_components/TaskMasterShell";

export default function TaskMasterPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={`${styles.atmosphereBlob} ${styles.blobPrimary}`} />
      <div className={`${styles.atmosphereBlob} ${styles.blobSecondary}`} />

      {/* The Brain is now separated */}
      <TaskMasterShell />
    </div>
  );
}
