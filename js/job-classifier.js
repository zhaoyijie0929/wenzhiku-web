function compactJobClassifyText(value) {
  return String(value || "").replace(/\s+/g, "");
}

function classifyJob(job) {
  const titleText = compactJobClassifyText(job?.title || "");
  if (/文员/.test(titleText)) return "管理岗";

  const typeText = compactJobClassifyText(job?.type || "");
  if (/普通工|技术工/.test(typeText)) return "技能岗";

  return "技术岗";
}

window.classifyJob = classifyJob;
