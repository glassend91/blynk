"use client";

import { useEffect, useState } from "react";
import Panel from "../Panel";
import apiClient from "@/lib/apiClient";

interface AddressInformation {
  streetAddress?: string;
  suburb?: string;
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
}

interface UserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  serviceAddress?: string;
  addressInformation?: AddressInformation;
  twoFactorAuthentication?: boolean;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  marketingCommunications?: boolean;
  serviceUpdates?: boolean;
  billingNotifications?: boolean;
}

export default function AccountManagement() {
  const [userData, setUserData] = useState<UserData>({});
  const [formData, setFormData] = useState<UserData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    field: string;
    label: string;
    newValue: boolean;
  }>({
    isOpen: false,
    field: "",
    label: "",
    newValue: false,
  });
  const [isUpdatingPreference, setIsUpdatingPreference] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/auth/me");
        setUserData(response?.data?.user);
        setFormData(response?.data?.user);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch user data");
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (key: keyof UserData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(userData);
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      // Exclude email and phone from update payload
      const { email, phone, ...updateData } = formData;

      const response = await apiClient.put("/auth/update", updateData);
      setUserData(response.data.user || formData);
      setFormData(response.data.user || formData);
      setIsEditing(false);
      setSuccess("Personal information updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user data");
      console.error("Error updating user data:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddressInputChange = (key: keyof AddressInformation, value: string) => {
    setFormData((prev) => ({
      ...prev,
      addressInformation: {
        ...prev.addressInformation,
        [key]: value,
      },
    }));
  };

  const handleEditAddress = () => {
    setIsEditingAddress(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancelAddress = () => {
    setIsEditingAddress(false);
    setFormData(userData);
    setError(null);
    setSuccess(null);
  };

  const handleSaveAddress = async () => {
    try {
      setIsSavingAddress(true);
      setError(null);
      setSuccess(null);

      const response = await apiClient.put("/auth/update", {
        addressInformation: formData.addressInformation,
      });
      setUserData(response.data.user || formData);
      setFormData(response.data.user || formData);
      setIsEditingAddress(false);
      setSuccess("Address information updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update address data");
      console.error("Error updating address data:", err);
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleOpenPasswordModal = () => {
    setIsPasswordModalOpen(true);
    setPasswordError(null);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordError(null);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    setPasswordError(null);
  };

  const handleChangePassword = async () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }

    try {
      setIsChangingPassword(true);
      setPasswordError(null);

      await apiClient.put("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setSuccess("Password changed successfully!");
      handleClosePasswordModal();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Failed to change password");
      console.error("Error changing password:", err);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleToggleChange = (field: string, label: string, currentValue: boolean) => {
    setConfirmModal({
      isOpen: true,
      field,
      label,
      newValue: !currentValue,
    });
  };

  const handleConfirmToggle = async () => {
    try {
      setIsUpdatingPreference(true);
      setError(null);

      const response = await apiClient.put("/auth/update", {
        [confirmModal.field]: confirmModal.newValue,
      });

      setUserData(response.data.user || { ...userData, [confirmModal.field]: confirmModal.newValue });
      setFormData(response.data.user || { ...formData, [confirmModal.field]: confirmModal.newValue });
      setSuccess(`${confirmModal.label} ${confirmModal.newValue ? "enabled" : "disabled"} successfully!`);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);

      setConfirmModal({ isOpen: false, field: "", label: "", newValue: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update preference");
      console.error("Error updating preference:", err);
    } finally {
      setIsUpdatingPreference(false);
    }
  };

  const handleCancelToggle = () => {
    setConfirmModal({ isOpen: false, field: "", label: "", newValue: false });
  };

  return (
    <>
      <h1 className="mb-6 text-[26px] font-bold text-[#0A0A0A]">Account Management</h1>

      {error && (
        <div className="mb-4 rounded-[12px] border border-red-300 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-[12px] border border-green-300 bg-green-50 p-4 text-sm text-green-600">
          {success}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <Panel className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[16px] font-semibold text-[#0A0A0A]">Personal Information</div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="rounded-[8px] border border-[#D9D4E5] px-3 py-1 text-[12px] text-[#3F205F] hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="rounded-[8px] bg-[#3F205F] px-3 py-1 text-[12px] text-white hover:bg-[#2F1545] disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="rounded-[8px] border border-[#D9D4E5] px-3 py-1 text-[12px] text-[#3F205F] hover:bg-gray-50"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "First Name", key: "firstName" as const, locked: false },
              { label: "Last Name", key: "lastName" as const, locked: false },
              { label: "Email Address", key: "email" as const, locked: true },
              { label: "Phone Number", key: "phone" as const, locked: true },
              { label: "Delivery Address", key: "serviceAddress" as const, locked: false },
            ].map(({ label, key, locked }, i) => {
              const isFieldEditable = isEditing && !locked;
              const fieldValue = formData[key] as string | undefined;
              return (
                <div key={label} className={i === 4 ? "col-span-2" : ""}>
                  <label className="mb-1 flex items-center gap-1 text-[13px] text-[#0A0A0A]">
                    {label}
                    {locked && (
                      <span className="text-[11px] text-[#6F6C90]" title="This field cannot be edited">
                        🔒
                      </span>
                    )}
                  </label>
                  <input
                    className={`h-[44px] w-full rounded-[12px] border px-3 text-[14px] outline-none ${isFieldEditable
                      ? "border-[#E5E2EA] bg-white focus:border-[#3F205F]"
                      : "border-[#E5E2EA] bg-[#F8F8FB] cursor-not-allowed"
                      }`}
                    placeholder={`Enter your ${label.toLowerCase()}`}
                    value={loading ? "Loading..." : (fieldValue || "")}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    readOnly={!isFieldEditable || loading}
                    disabled={loading || locked}
                  />
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[16px] font-semibold text-[#0A0A0A]">Address Information</div>
            <div className="flex gap-2">
              {isEditingAddress ? (
                <>
                  <button
                    onClick={handleCancelAddress}
                    disabled={isSavingAddress}
                    className="rounded-[8px] border border-[#D9D4E5] px-3 py-1 text-[12px] text-[#3F205F] hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveAddress}
                    disabled={isSavingAddress}
                    className="rounded-[8px] bg-[#3F205F] px-3 py-1 text-[12px] text-white hover:bg-[#2F1545] disabled:opacity-50"
                  >
                    {isSavingAddress ? "Saving..." : "Save"}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditAddress}
                  className="rounded-[8px] border border-[#D9D4E5] px-3 py-1 text-[12px] text-[#3F205F] hover:bg-gray-50"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Street Address", key: "streetAddress" },
              { label: "Suburb", key: "suburb" },
              { label: "City", key: "city" },
              { label: "State", key: "state" },
              { label: "Country", key: "country" },
              { label: "Postcode", key: "postcode" },
            ].map(({ label, key }) => (
              <div key={label}>
                <label className="mb-1 block text-[13px] text-[#0A0A0A]">{label}</label>
                <input
                  className={`h-[44px] w-full rounded-[12px] border px-3 text-[14px] outline-none ${isEditingAddress
                    ? "border-[#E5E2EA] bg-white focus:border-[#3F205F]"
                    : "border-[#E5E2EA] bg-[#F8F8FB] cursor-not-allowed"
                    }`}
                  placeholder={`Enter your ${label.toLowerCase()}`}
                  value={loading ? "Loading..." : (formData.addressInformation?.[key as keyof AddressInformation] || "")}
                  onChange={(e) => handleAddressInputChange(key as keyof AddressInformation, e.target.value)}
                  readOnly={!isEditingAddress || loading}
                  disabled={loading}
                />
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <Panel className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[16px] font-semibold text-[#0A0A0A]">Security Settings</div>
            <button
              onClick={handleOpenPasswordModal}
              className="rounded-[8px] border border-[#D9D4E5] px-3 py-1 text-[12px] text-[#3F205F] hover:bg-gray-50"
            >
              Change Password
            </button>
          </div>

          <div className="space-y-3">
            {[
              { title: "Two-Factor Authentication", desc: "Add an extra layer of security to your account", field: "twoFactorAuthentication" as const },
              { title: "Email Notifications", desc: "Receive security alerts and account updates", field: "emailNotifications" as const },
              { title: "SMS Notifications", desc: "Receive service alerts and payment reminders", field: "smsNotifications" as const },
            ].map(({ title, desc, field }) => (
              <ToggleRow
                key={title}
                title={title}
                desc={desc}
                checked={formData[field] ?? true}
                onChange={() => handleToggleChange(field, title, formData[field] ?? true)}
                disabled={loading}
              />
            ))}
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="mb-4 text-[16px] font-semibold text-[#0A0A0A]">Communication Preferences</div>

          <div className="space-y-3">
            {[
              { title: "Marketing Communications", desc: "Receive offers and product updates", field: "marketingCommunications" as const },
              { title: "Service Updates", desc: "Network maintenance and service improvements", field: "serviceUpdates" as const },
              { title: "Billing Notifications", desc: "Invoice and payment confirmations", field: "billingNotifications" as const },
            ].map(({ title, desc, field }) => (
              <ToggleRow
                key={title}
                title={title}
                desc={desc}
                checked={formData[field] ?? true}
                onChange={() => handleToggleChange(field, title, formData[field] ?? true)}
                disabled={loading}
              />
            ))}
          </div>
        </Panel>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div
          // className="fixed z-50 flex items-center justify-center"
          // style={{
          //   top: 0,
          //   left: 0,
          //   right: 0,
          //   bottom: 0,
          //   margin: 0,
          //   padding: 0,
          //   width: '100vw',
          //   height: '100vh'
          // }}
        >
          <div
            className="fixed bg-black"
            onClick={handleClosePasswordModal}
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              // width: '100vw',
              // height: '100vh',
              // zIndex: 50,
              opacity: 0.5
            }}
          />
          <div
            className="fixed z-51 w-full max-w-md rounded-[16px] bg-white p-6 shadow-xl"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[20px] font-bold text-[#0A0A0A]">Change Password</h2>
              <button
                onClick={handleClosePasswordModal}
                className="text-[24px] text-[#6F6C90] hover:text-[#0A0A0A]"
              >
                ×
              </button>
            </div>

            {passwordError && (
              <div className="mb-4 rounded-[12px] border border-red-300 bg-red-50 p-3 text-sm text-red-600">
                {passwordError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-[13px] text-[#0A0A0A]">Current Password</label>
                <input
                  type="password"
                  className="h-[44px] w-full rounded-[12px] border border-[#E5E2EA] bg-white px-3 text-[14px] outline-none focus:border-[#3F205F]"
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordInputChange("currentPassword", e.target.value)}
                  disabled={isChangingPassword}
                />
              </div>

              <div>
                <label className="mb-1 block text-[13px] text-[#0A0A0A]">New Password</label>
                <input
                  type="password"
                  className="h-[44px] w-full rounded-[12px] border border-[#E5E2EA] bg-white px-3 text-[14px] outline-none focus:border-[#3F205F]"
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordInputChange("newPassword", e.target.value)}
                  disabled={isChangingPassword}
                />
              </div>

              <div>
                <label className="mb-1 block text-[13px] text-[#0A0A0A]">Confirm New Password</label>
                <input
                  type="password"
                  className="h-[44px] w-full rounded-[12px] border border-[#E5E2EA] bg-white px-3 text-[14px] outline-none focus:border-[#3F205F]"
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordInputChange("confirmPassword", e.target.value)}
                  disabled={isChangingPassword}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleClosePasswordModal}
                disabled={isChangingPassword}
                className="flex-1 rounded-[12px] border border-[#D9D4E5] py-2.5 text-[14px] text-[#3F205F] hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={isChangingPassword}
                className="flex-1 rounded-[12px] bg-[#3F205F] py-2.5 text-[14px] text-white hover:bg-[#2F1545] disabled:opacity-50"
              >
                {isChangingPassword ? "Changing..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Toggle Changes */}
      {confirmModal.isOpen && (
        <div
          className="fixed z-50 flex items-center justify-center"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            padding: 0,
            width: '100vw',
            height: '100vh'
          }}
        >
          <div
            className="fixed bg-black"
            onClick={() => setConfirmModal({ isOpen: false, field: "", label: "", newValue: false })}
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 50,
              opacity: 0.5
            }}
          />
          <div
            className="fixed z-51 w-full max-w-md rounded-[16px] bg-white p-6 shadow-xl"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="mb-4">
              <h2 className="text-[20px] font-bold text-[#0A0A0A]">Confirm Change</h2>
            </div>

            <p className="mb-6 text-[14px] text-[#6F6C90]">
              Are you sure you want to {confirmModal.newValue ? "enable" : "disable"}{" "}
              <span className="font-semibold text-[#0A0A0A]">{confirmModal.label}</span>?
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleCancelToggle}
                disabled={isUpdatingPreference}
                className="flex-1 rounded-[12px] border border-[#D9D4E5] py-2.5 text-[14px] text-[#3F205F] hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmToggle}
                disabled={isUpdatingPreference}
                className="flex-1 rounded-[12px] bg-[#3F205F] py-2.5 text-[14px] text-white hover:bg-[#2F1545] disabled:opacity-50"
              >
                {isUpdatingPreference ? "Updating..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ToggleRow({
  title,
  desc,
  checked = true,
  onChange,
  disabled = false
}: {
  title: string;
  desc: string;
  checked?: boolean;
  onChange?: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-[12px] border border-[#EEEAF4] bg-[#F7F7FA] px-4 py-3">
      <div>
        <div className="text-[14px] font-semibold text-[#0A0A0A]">{title}</div>
        <div className="text-[12px] text-[#6F6C90]">{desc}</div>
      </div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
        <div className={`peer h-5 w-9 rounded-full ${checked ? "bg-[#3F205F]" : "bg-[#D9D4E5]"} transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-4 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}></div>
      </label>
    </div>
  );
}
