import React from "react";
import {
  Activity,
  Brain,
  Heart,
  Waves,
  Bone,
  Monitor,
  Clock,
} from "lucide-react";
import DepartmentView from "./DepartmentView";
import { Patient, Report } from "../types";

interface DepartmentComponentProps {
  patients: Patient[];
  reports: Report[];
}

// CT Department Component
export const CTDepartment: React.FC<DepartmentComponentProps> = ({
  patients,
  reports,
}) => (
  <DepartmentView
    patients={patients}
    reports={reports}
    departmentName="CT"
    departmentIcon={Activity}
  />
);

// MRI Department Component
export const MRIDepartment: React.FC<DepartmentComponentProps> = ({
  patients,
  reports,
}) => (
  <DepartmentView
    patients={patients}
    reports={reports}
    departmentName="MRI"
    departmentIcon={Brain}
  />
);

// ECG Department Component
export const ECGDepartment: React.FC<DepartmentComponentProps> = ({
  patients,
  reports,
}) => (
  <DepartmentView
    patients={patients}
    reports={reports}
    departmentName="ECG"
    departmentIcon={Heart}
  />
);

// USG Department Component
export const USGDepartment: React.FC<DepartmentComponentProps> = ({
  patients,
  reports,
}) => (
  <DepartmentView
    patients={patients}
    reports={reports}
    departmentName="USG"
    departmentIcon={Waves}
  />
);

// X-ray Department Component
export const XrayDepartment: React.FC<DepartmentComponentProps> = ({
  patients,
  reports,
}) => (
  <DepartmentView
    patients={patients}
    reports={reports}
    departmentName="X-ray"
    departmentIcon={Bone}
  />
);

// TMT Department Component
export const TMTDepartment: React.FC<DepartmentComponentProps> = ({
  patients,
  reports,
}) => (
  <DepartmentView
    patients={patients}
    reports={reports}
    departmentName="TMT"
    departmentIcon={Monitor}
  />
);

// Holter Department Component
export const HolterDepartment: React.FC<DepartmentComponentProps> = ({
  patients,
  reports,
}) => (
  <DepartmentView
    patients={patients}
    reports={reports}
    departmentName="Holter"
    departmentIcon={Clock}
  />
);

// Export all components for easy importing
export {
  CTDepartment as CT,
  MRIDepartment as MRI,
  ECGDepartment as ECG,
  USGDepartment as USG,
  XrayDepartment as Xray,
  TMTDepartment as TMT,
  HolterDepartment as Holter,
};