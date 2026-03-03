export interface Department {
  id: string;
  name: string;
}

export interface InternalCollision {
  id: string;
  source: string;
  target: string;
  description: string;
}

export interface Ministry {
  id: string;
  name: string;
  shortName: string;
  departments: Department[];
  internalCollisions: InternalCollision[];
}

export interface ExternalCollision {
  id: string;
  source: string;
  target: string;
  title: string;
  description: string;
}

export interface GovData {
  ministries: Ministry[];
  externalCollisions: ExternalCollision[];
}

export const govData: GovData = {
  ministries: [
    {
      id: "min_digital",
      name: "Министерство цифрового развития, инноваций и аэрокосмической промышленности",
      shortName: "МЦРИАП",
      departments: [
        { id: "dep_govservices", name: "Комитет государственных услуг" },
        { id: "dep_infosec", name: "Комитет информационной безопасности" },
        { id: "dep_egov", name: "Департамент развития электронного правительства" },
        { id: "dep_data", name: "Управление управления данными" }
      ],
      internalCollisions: [
        {
          id: "int_col_1",
          source: "dep_govservices",
          target: "dep_egov",
          description: "Дублирование функций по оптимизации и автоматизации процессов оказания государственных услуг."
        }
      ]
    },
    {
      id: "min_internal",
      name: "Министерство внутренних дел",
      shortName: "МВД",
      departments: [
        { id: "dep_migration", name: "Комитет миграционной службы" },
        { id: "dep_adminpol", name: "Комитет административной полиции" },
        { id: "dep_it", name: "Департамент информатизации и связи" }
      ],
      internalCollisions: []
    },
    {
      id: "min_justice",
      name: "Министерство юстиции",
      shortName: "МЮ",
      departments: [
        { id: "dep_registration", name: "Департамент регистрационной службы и организации юридических услуг" },
        { id: "dep_legislation", name: "Департамент законодательства" },
        { id: "dep_ip", name: "Департамент по правам интеллектуальной собственности" }
      ],
      internalCollisions: []
    },
    {
      id: "min_health",
      name: "Министерство здравоохранения",
      shortName: "МЗ",
      departments: [
        { id: "dep_medservices", name: "Департамент организации медицинской помощи" },
        { id: "dep_ehealth", name: "Департамент цифровизации здравоохранения" }
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
      description: "Пересечение полномочий в части ведения и интеграции баз данных граждан (Национальный реестр индивидуальных идентификационных номеров и база документирования населения)."
    },
    {
      id: "ext_col_2",
      source: "min_digital",
      target: "min_justice",
      title: "Регистрация юрлиц",
      description: "Дублирование функций по техническому сопровождению и нормативному регулированию процесса электронной регистрации юридических лиц."
    },
    {
      id: "ext_col_3",
      source: "min_digital",
      target: "min_health",
      title: "Медицинские данные",
      description: "Неясность зон ответственности при сборе и хранении медицинских данных граждан в мобильном приложении электронного правительства."
    }
  ]
};
