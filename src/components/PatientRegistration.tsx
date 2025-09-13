import React, { useState } from "react";
import {
  User,
  MapPin,
  Hash,
  Building2,
  Save,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { Patient, Department } from "../types";

interface PatientRegistrationProps {
  onAddPatient: (patient: Omit<Patient, "id" | "createdAt">) => void;
}

const PatientRegistration: React.FC<PatientRegistrationProps> = ({
  onAddPatient,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    number: "",
    address: "",
    department: "" as Department | "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments: Department[] = [
    "CT",
    "MRI",
    "ECG",
    "USG",
    "X-ray",
    "TMT",
    "Holter",
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Patient name is required";
    }

    if (!formData.age.trim()) {
      newErrors.age = "Patient age is required";
    } else {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 0 || age > 150) {
        newErrors.age = "Please enter a valid age (0-150)";
      }
    }

    if (!formData.number.trim()) {
      newErrors.number = "Patient number is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.department) {
      newErrors.department = "Department selection is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onAddPatient({
        name: formData.name.trim(),
        age: formData.age.trim(),
        number: formData.number.trim(),
        address: formData.address.trim(),
        department: formData.department as Department,
      });

      // Reset form
      setFormData({
        name: "",
        age: "",
        number: "",
        address: "",
        department: "",
      });
      setErrors({});

      // Show success message (you could add a toast notification here)
      alert("Patient registered successfully!");
    } catch (error) {
      console.error("Error registering patient:", error);
      alert("Error registering patient. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="registration-container">
      <div className="patient-registration">
        <style>{`
          .registration-container {
            background: linear-gradient(135deg, #3b82f6 0%, #93c5fd 25%, #ffffff 50%, #dbeafe 75%, #1e40af 100%);
            min-height: 100vh;
            padding: 1rem;
          }

          .patient-registration {
            max-width: 100%;
            margin: 0 auto;
            padding: 0;
          }

          .form-container {
            background-color: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 0 20px rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 1.5rem;
            transition: all 0.3s ease;
          }

          .form-container:hover {
            box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 0 30px rgba(59, 130, 246, 0.2);
          }

          .form-header {
            margin-bottom: 1.5rem;
          }

          .form-title {
            font-size: 1.5rem;
            font-weight: bold;
            color: #1e40af;
            margin: 0 0 0.5rem 0;
          }

          .form-subtitle {
            color: #6b7280;
            margin: 0;
            font-size: 0.875rem;
          }

          .form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .form-group {
            display: flex;
            flex-direction: column;
          }

          .form-label {
            display: block;
            font-size: 0.875rem;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.95);
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .form-label svg {
            color: rgba(255, 255, 255, 0.9);
          }

          .form-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: all 0.3s ease;
            box-sizing: border-box;
            background-color: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(5px);
          }

          .form-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            background-color: rgba(255, 255, 255, 0.95);
          }

          .form-input.error {
            border-color: #ef4444;
            background-color: rgba(254, 242, 242, 0.9);
          }

          .form-textarea {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: all 0.3s ease;
            resize: none;
            font-family: inherit;
            box-sizing: border-box;
            background-color: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(5px);
          }

          .form-textarea:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            background-color: rgba(255, 255, 255, 0.95);
          }

          .form-textarea.error {
            border-color: #ef4444;
            background-color: rgba(254, 242, 242, 0.9);
          }

          .form-select {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: all 0.3s ease;
            background-color: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(5px);
            box-sizing: border-box;
          }

          .form-select:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            background-color: rgba(255, 255, 255, 0.95);
          }

          .form-select.error {
            border-color: #ef4444;
            background-color: rgba(254, 242, 242, 0.9);
          }

          .error-message {
            margin-top: 0.25rem;
            font-size: 0.875rem;
            color: #dc2626;
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }

          .submit-section {
            padding-top: 1rem;
          }

          .submit-button {
            width: 100%;
            background: linear-gradient(135deg, #3b82f6, #1e40af);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            font-size: 1rem;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          }

          .submit-button:hover:not(:disabled) {
            background: linear-gradient(135deg, #1d4ed8, #1e3a8a);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
            transform: translateY(-2px);
          }

          .submit-button:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
          }

          .submit-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
          }

          .loading-spinner {
            width: 1.25rem;
            height: 1.25rem;
            border: 2px solid white;
            border-top: 2px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          @media (min-width: 640px) {
            .registration-container {
              padding: 1.5rem;
            }

            .patient-registration {
              max-width: 42rem;
              padding: 0 1rem;
            }

            .form-container {
              padding: 2rem;
            }

            .form-header {
              margin-bottom: 2rem;
            }

            .form-title {
              font-size: 1.875rem;
            }

            .form-subtitle {
              font-size: 1rem;
            }

            .form {
              gap: 1.5rem;
            }

            .form-input {
              padding: 0.75rem 1rem;
            }

            .form-textarea {
              padding: 0.75rem 1rem;
            }

            .form-select {
              padding: 0.75rem 1rem;
            }

            .submit-button {
              padding: 0.75rem 1.5rem;
            }
          }

          @media (min-width: 768px) {
            .form-container {
              padding: 2rem;
            }

            .submit-section {
              padding-top: 1rem;
            }
          }

          @media (min-width: 1024px) {
            .patient-registration {
              max-width: 42rem;
            }
          }
        `}</style>

        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">Patient Registration</h2>
            <p className="form-subtitle">
              Register a new patient in the radiology department
            </p>
          </div>

          <form onSubmit={handleSubmit} className="form">
            {/* Patient Name */}
            <div className="form-group">
              <label className="form-label">
                <User size={16} />
                Patient Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`form-input ${errors.name ? "error" : ""}`}
                placeholder="Enter patient's full name"
              />
              {errors.name && (
                <p className="error-message">
                  <AlertCircle size={16} />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Patient Age */}
            <div className="form-group">
              <label className="form-label">
                <Calendar size={16} />
                Patient Age
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                className={`form-input ${errors.age ? "error" : ""}`}
                placeholder="Enter patient's age"
                min="0"
                max="150"
              />
              {errors.age && (
                <p className="error-message">
                  <AlertCircle size={16} />
                  {errors.age}
                </p>
              )}
            </div>

            {/* Patient Number */}
            <div className="form-group">
              <label className="form-label">
                <Hash size={16} />
                Patient Number
              </label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) => handleInputChange("number", e.target.value)}
                className={`form-input ${errors.number ? "error" : ""}`}
                placeholder="Enter patient number (e.g., P001)"
              />
              {errors.number && (
                <p className="error-message">
                  <AlertCircle size={16} />
                  {errors.number}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="form-label">
                <MapPin size={16} />
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows={3}
                className={`form-textarea ${errors.address ? "error" : ""}`}
                placeholder="Enter patient's complete address"
              />
              {errors.address && (
                <p className="error-message">
                  <AlertCircle size={16} />
                  {errors.address}
                </p>
              )}
            </div>

            {/* Department */}
            <div className="form-group">
              <label className="form-label">
                <Building2 size={16} />
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) =>
                  handleInputChange("department", e.target.value)
                }
                className={`form-select ${errors.department ? "error" : ""}`}
              >
                <option value="">Select a department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept} -{" "}
                    {dept === "CT"
                      ? "Computed Tomography"
                      : dept === "MRI"
                      ? "Magnetic Resonance Imaging"
                      : dept === "ECG"
                      ? "Electrocardiogram"
                      : dept === "USG"
                      ? "Ultrasonography"
                      : dept === "TMT"
                      ? "Treadmill Test"
                      : dept === "Holter"
                      ? "Holter Monitor"
                      : "X-ray"}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="error-message">
                  <AlertCircle size={16} />
                  {errors.department}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="submit-section">
              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-button"
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner"></div>
                    Registering...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Register Patient
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;