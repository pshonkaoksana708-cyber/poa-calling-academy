export type CertificateStatus = "active" | "revoked";

export type AcademyCertificate = {
  id: string;
  studentName: string;
  title: string;
  courseName: string;
  hours: string;
  skills: string[];
  date: string;
  status: CertificateStatus;
};

export const courseCertificateData = {
  supply: {
    title: "Специалист по снабжению",
    hours: "120 часов",
    skills: [
      "работа с поставщиками",
      "закупочные процессы",
      "переговоры",
      "анализ рынка",
    ],
  },
  hr: {
    title: "Специалист по кадрам и управлению персоналом",
    hours: "120 часов",
    skills: [
      "подбор сотрудников",
      "работа с вакансиями и резюме",
      "собеседования",
      "адаптация новых сотрудников",
    ],
  },
  tourism: {
    title: "Специалист по туризму",
    hours: "120 часов",
    skills: [
      "подбор туристического продукта",
      "работа с клиентским запросом",
      "маршруты и логистика путешествия",
      "туристический сервис",
    ],
  },
};

export const certificates: AcademyCertificate[] = [
  {
    id: "DEMO-2026-000001",
    studentName: "",
    title: courseCertificateData.supply.title,
    courseName: "Специалист по снабжению",
    hours: courseCertificateData.supply.hours,
    skills: courseCertificateData.supply.skills,
    date: "",
    status: "active",
  },
];

export function generateCertificateNumber(sequence: number, year = 2026) {
  return `APR-${year}-${String(sequence).padStart(6, "0")}`;
}

export function getCertificateById(id: string) {
  return certificates.find(
    (certificate) => certificate.id.toLowerCase() === id.trim().toLowerCase(),
  );
}
