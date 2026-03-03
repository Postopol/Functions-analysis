export type DepType = 'committee' | 'department' | 'division';
export type CollisionLevel = 'min' | 'com' | 'dep' | 'upr' | 'mixed';

export interface WorkloadData {
  index: number; // Индекс нагрузки в процентах (например, 120% - перегруз)
  avgHours: number; // Среднее время на работе по СКУД (в часах)
  functionsPerEmployee: number; // Количество функций на 1 сотрудника
}

export interface Department {
  id: string;
  name: string;
  type: DepType;
  staffCount: number;
  functions: string[];
  workload: WorkloadData;
}

export interface InternalCollision {
  id: string;
  source: string;
  target: string;
  title: string;
  description: string;
  level: CollisionLevel;
  criticality: number;
  similarity: number;
}

export interface Ministry {
  id: string;
  name: string;
  shortName: string;
  staffCount: number;
  functions: string[];
  workload: WorkloadData;
  departments: Department[];
  internalCollisions: InternalCollision[];
}

export interface ExternalCollision {
  id: string;
  source: string;
  target: string;
  title: string;
  description: string;
  level: CollisionLevel;
  criticality: number;
  similarity: number;
}

export interface CrossDepartmentCollision {
  id: string;
  sourceMinId: string;
  sourceDepId: string;
  targetMinId: string;
  targetDepId: string;
  title: string;
  description: string;
  level: CollisionLevel;
  criticality: number;
  similarity: number;
}

export interface GovData {
  ministries: Ministry[];
  externalCollisions: ExternalCollision[];
  crossDepartmentCollisions: CrossDepartmentCollision[];
}

export const govData: GovData = {
  ministries: [
    {
      id: "min_digital",
      name: "Министерство цифрового развития, инноваций и аэрокосмической промышленности",
      shortName: "МЦРИАП",
      staffCount: 850,
      workload: { index: 115, avgHours: 9.8, functionsPerEmployee: 4.2 },
      functions: [
        "Формирование и реализация государственной политики в сфере цифрового развития",
        "Управление электронным правительством",
        "Обеспечение информационной безопасности",
        "Развитие аэрокосмической промышленности"
      ],
      departments: [
        { 
          id: "dep_govservices", 
          name: "Комитет государственных услуг", 
          type: "committee",
          staffCount: 150,
          workload: { index: 125, avgHours: 10.2, functionsPerEmployee: 5.1 },
          functions: ["Координация деятельности ЦОНов", "Оптимизация процессов оказания госуслуг", "Контроль качества госуслуг"]
        },
        { 
          id: "dep_telecom", 
          name: "Комитет телекоммуникаций", 
          type: "committee",
          staffCount: 120,
          workload: { index: 95, avgHours: 8.5, functionsPerEmployee: 2.8 },
          functions: ["Регулирование связи", "Распределение радиочастот", "Контроль операторов связи"]
        },
        { 
          id: "dep_egov", 
          name: "Департамент развития электронного правительства", 
          type: "department",
          staffCount: 80,
          workload: { index: 140, avgHours: 11.5, functionsPerEmployee: 6.5 },
          functions: ["Архитектура eGov", "Интеграция информационных систем", "Развитие портала egov.kz"]
        },
        { 
          id: "dep_digital_transform", 
          name: "Департамент цифровой трансформации", 
          type: "department",
          staffCount: 65,
          workload: { index: 110, avgHours: 9.2, functionsPerEmployee: 3.5 },
          functions: ["Реинжиниринг бизнес-процессов госорганов", "Внедрение цифровых решений", "Методология цифровизации"]
        },
        { 
          id: "dep_data", 
          name: "Управление данными", 
          type: "division",
          staffCount: 30,
          workload: { index: 130, avgHours: 10.5, functionsPerEmployee: 5.8 },
          functions: ["Сбор и классификация государственных данных", "Ведение реестра НСИ", "Открытые данные"]
        },
        { 
          id: "dep_analytics", 
          name: "Управление аналитики", 
          type: "division",
          staffCount: 25,
          workload: { index: 85, avgHours: 8.0, functionsPerEmployee: 2.1 },
          functions: ["Анализ больших данных", "Подготовка аналитических отчетов", "Прогнозирование"]
        }
      ],
      internalCollisions: [
        {
          id: "int_col_1",
          source: "dep_govservices",
          target: "dep_telecom",
          title: "Контроль качества связи",
          description: "Дублирование функций по контролю качества каналов связи в ЦОНах.",
          level: "com",
          criticality: 3,
          similarity: 65
        },
        {
          id: "int_col_2",
          source: "dep_egov",
          target: "dep_digital_transform",
          title: "Проектирование архитектуры",
          description: "Пересечение полномочий при проектировании архитектуры новых цифровых сервисов для госорганов.",
          level: "dep",
          criticality: 4,
          similarity: 80
        },
        {
          id: "int_col_3",
          source: "dep_data",
          target: "dep_analytics",
          title: "Работа с открытыми данными",
          description: "Неясность зон ответственности при сборе, очистке и публикации наборов открытых данных.",
          level: "upr",
          criticality: 2,
          similarity: 45
        }
      ]
    },
    {
      id: "min_internal",
      name: "Министерство внутренних дел",
      shortName: "МВД",
      staffCount: 120000,
      workload: { index: 135, avgHours: 11.0, functionsPerEmployee: 3.8 },
      functions: [
        "Охрана общественного порядка",
        "Борьба с преступностью",
        "Обеспечение безопасности дорожного движения",
        "Миграционный контроль"
      ],
      departments: [
        { id: "dep_migration", name: "Комитет миграционной службы", type: "committee", staffCount: 450, workload: { index: 110, avgHours: 9.5, functionsPerEmployee: 4.0 }, functions: ["Учет иностранных граждан", "Выдача виз", "Контроль миграции"] },
        { id: "dep_adminpol", name: "Комитет административной полиции", type: "committee", staffCount: 800, workload: { index: 145, avgHours: 12.0, functionsPerEmployee: 5.2 }, functions: ["Охрана порядка", "Контроль за оборотом оружия"] },
        { id: "dep_it", name: "Департамент информатизации и связи", type: "department", staffCount: 120, workload: { index: 90, avgHours: 8.2, functionsPerEmployee: 2.5 }, functions: ["Обеспечение связи ОВД", "Ведение баз данных"] }
      ],
      internalCollisions: []
    },
    {
      id: "min_justice",
      name: "Министерство юстиции",
      shortName: "МЮ",
      staffCount: 4500,
      workload: { index: 95, avgHours: 8.5, functionsPerEmployee: 2.9 },
      functions: [
        "Правовое обеспечение деятельности государства",
        "Регистрация юридических лиц и прав на недвижимость",
        "Защита прав интеллектуальной собственности"
      ],
      departments: [
        { id: "dep_registration", name: "Департамент регистрационной службы", type: "department", staffCount: 200, workload: { index: 105, avgHours: 9.0, functionsPerEmployee: 3.5 }, functions: ["Регистрация юрлиц", "Регистрация актов гражданского состояния"] },
        { id: "dep_legislation", name: "Департамент законодательства", type: "department", staffCount: 150, workload: { index: 85, avgHours: 8.0, functionsPerEmployee: 2.2 }, functions: ["Экспертиза законопроектов", "Систематизация НПА"] }
      ],
      internalCollisions: []
    },
    {
      id: "min_health",
      name: "Министерство здравоохранения",
      shortName: "МЗ",
      staffCount: 3200,
      workload: { index: 125, avgHours: 10.5, functionsPerEmployee: 4.8 },
      functions: [
        "Охрана здоровья граждан",
        "Санитарно-эпидемиологическое благополучие",
        "Регулирование сферы обращения лекарственных средств"
      ],
      departments: [
        { id: "dep_medservices", name: "Департамент организации медицинской помощи", type: "department", staffCount: 180, workload: { index: 130, avgHours: 11.0, functionsPerEmployee: 5.5 }, functions: ["Стандарты медпомощи", "Координация больниц"] },
        { id: "dep_ehealth", name: "Департамент цифровизации здравоохранения", type: "department", staffCount: 60, workload: { index: 115, avgHours: 9.8, functionsPerEmployee: 4.0 }, functions: ["Электронные паспорта здоровья", "Интеграция мединформсистем"] }
      ],
      internalCollisions: []
    }
  ],
  externalCollisions: [
    {
      id: "ext_col_1",
      source: "min_digital",
      target: "min_internal",
      title: "Базы данных граждан",
      description: "Пересечение полномочий в части ведения и интеграции баз данных граждан (Национальный реестр индивидуальных идентификационных номеров и база документирования населения).",
      level: "min",
      criticality: 5,
      similarity: 95
    },
    {
      id: "ext_col_2",
      source: "min_digital",
      target: "min_justice",
      title: "Регистрация юрлиц",
      description: "Дублирование функций по техническому сопровождению и нормативному регулированию процесса электронной регистрации юридических лиц.",
      level: "min",
      criticality: 4,
      similarity: 75
    },
    {
      id: "ext_col_3",
      source: "min_digital",
      target: "min_health",
      title: "Медицинские данные",
      description: "Неясность зон ответственности при сборе и хранении медицинских данных граждан в мобильном приложении электронного правительства.",
      level: "min",
      criticality: 5,
      similarity: 85
    }
  ],
  crossDepartmentCollisions: [
    {
      id: "cross_col_1",
      sourceMinId: "min_digital",
      sourceDepId: "dep_egov",
      targetMinId: "min_internal",
      targetDepId: "dep_it",
      title: "Сопровождение ведомственных ИС",
      description: "Дублирование функций по разработке и сопровождению ведомственных информационных систем и баз данных.",
      level: "dep",
      criticality: 3,
      similarity: 60
    },
    {
      id: "cross_col_2",
      sourceMinId: "min_justice",
      sourceDepId: "dep_registration",
      targetMinId: "min_digital",
      targetDepId: "dep_govservices",
      title: "Услуги регистрации юрлиц",
      description: "Пересечение процессов при оказании услуг по регистрации юридических лиц через портал eGov и ЦОНы.",
      level: "mixed",
      criticality: 4,
      similarity: 80
    },
    {
      id: "cross_col_3",
      sourceMinId: "min_health",
      sourceDepId: "dep_ehealth",
      targetMinId: "min_digital",
      targetDepId: "dep_data",
      title: "Медицинская статистика",
      description: "Дублирование сбора медицинской статистики и формирования национальных витрин данных.",
      level: "mixed",
      criticality: 2,
      similarity: 40
    },
    {
      id: "cross_col_4",
      sourceMinId: "min_internal",
      sourceDepId: "dep_migration",
      targetMinId: "min_digital",
      targetDepId: "dep_govservices",
      title: "Учет иностранных граждан",
      description: "Параллельный учет и выдача документов иностранным гражданам через миграционную полицию и ЦОНы.",
      level: "com",
      criticality: 5,
      similarity: 90
    }
  ]
};
