"use client";

import { useState, useEffect } from "react";
import {
  getServices,
  subscribeToService,
  type Service,
} from "../lib/services/services";
import { getCurrentUser } from "../lib/services/auth";
import { useRouter } from "next/navigation";
import {
  getPaymentMethods,
  type PaymentMethod,
} from "../lib/services/paymentMethods";

interface BuyServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ServiceSelectionProps {
  onClose: () => void;
  onSuccess: () => void;
}

function ServiceSelection({ onClose, onSuccess }: ServiceSelectionProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const router = useRouter();
  const [step, setStep] = useState<
    "services" | "addons" | "payment" | "review"
  >("services");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Determine which serviceType to request based on current user's type
      let serviceParams: { serviceType?: string } | undefined = undefined;
      try {
        const userResp = await getCurrentUser();
        const userType = userResp?.user?.type;
        const TYPE_TO_SERVICE_TYPE: Record<string, string> = {
          NBN: "NBN",
          MBL: "Mobile",
          MBB: "Data Only",
          SME: "Business NBN",
        };
        if (userType && TYPE_TO_SERVICE_TYPE[userType]) {
          serviceParams = { serviceType: TYPE_TO_SERVICE_TYPE[userType] };
        }
      } catch (e) {
        // If fetching user fails, fall back to requesting all services
      }

      const [servicesData, paymentMethodsData] = await Promise.all([
        getServices(serviceParams),
        getPaymentMethods(),
      ]);
      console.log("Loaded payment methods:", servicesData);
      setServices(servicesData.services || []);
      setPaymentMethods(paymentMethodsData.paymentMethods || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setSelectedAddOns([]);
    setStep("addons");
  };

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnId)
        ? prev.filter((id) => id !== addOnId)
        : [...prev, addOnId],
    );
  };

  const handleNextStep = () => {
    if (step === "addons") {
      setStep("payment");
    } else if (step === "payment") {
      setStep("review");
    }
  };

  const handlePrevStep = () => {
    if (step === "review") {
      setStep("payment");
    } else if (step === "payment") {
      setStep("addons");
    } else if (step === "addons") {
      setStep("services");
    }
  };

  const handleSubscribe = async () => {
    if (!selectedService || !selectedPaymentMethod) return;

    try {
      setSubscribing(true);
      setError(null);

      await subscribeToService(selectedService._id, {
        selectedAddOns,
        paymentMethodId: selectedPaymentMethod,
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to subscribe to service",
      );
    } finally {
      setSubscribing(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedService) return 0;

    let total = selectedService?.price;
    const selectedAddOnObjects = selectedService?.addOns?.filter((addon) =>
      selectedAddOns.includes(addon?._id),
    );

    selectedAddOnObjects?.forEach((addon) => {
      total += addon?.price;
    });

    return total;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4">
        {["services", "addons", "payment", "review"].map((stepName, index) => (
          <div key={stepName} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === stepName
                  ? "bg-[#3F205F] text-white"
                  : ["services", "addons", "payment", "review"].indexOf(step) >
                      index
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              {index + 1}
            </div>
            {index < 3 && (
              <div
                className={`w-12 h-1 mx-2 ${
                  ["services", "addons", "payment", "review"].indexOf(step) >
                  index
                    ? "bg-green-500"
                    : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Services Selection */}
      {step === "services" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Select a Service</h3>
          <div className="grid gap-4">
            {services.map((service) => (
              <div
                key={service._id}
                onClick={() => handleServiceSelect(service)}
                className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-[#3F205F] hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-[#0A0A0A]">
                      {service.serviceName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {service.serviceType}
                    </p>
                    <p className="text-sm text-gray-500">
                      {service.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#3F205F]">
                      ${service.price.toFixed(2)}/month
                    </p>
                    <p className="text-xs text-gray-500">
                      {service.billingCycle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add-ons Selection */}
      {step === "addons" && selectedService && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Select Add-ons</h3>
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold">{selectedService.serviceName}</h4>
            <p className="text-sm text-gray-600">
              Base price: ${selectedService.price.toFixed(2)}/month
            </p>
          </div>

          {selectedService.addOns && selectedService.addOns.length > 0 ? (
            <div className="space-y-3">
              {selectedService.addOns.map((addon) => (
                <div
                  key={addon._id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedAddOns.includes(addon._id)}
                      onChange={() => handleAddOnToggle(addon._id)}
                      className="h-4 w-4 text-[#3F205F] rounded border-gray-300"
                    />
                    <div className="ml-3">
                      <h5 className="font-medium">{addon.name}</h5>
                      <p className="text-sm text-gray-600">
                        {addon.description}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-[#3F205F]">
                    +${addon.price.toFixed(2)}/month
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No add-ons available for this service.
            </p>
          )}
        </div>
      )}

      {/* Payment Method Selection */}
      {step === "payment" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
          {paymentMethods.length > 0 ? (
            <div className="space-y-3">
              {paymentMethods.map((paymentMethod) => (
                <div
                  key={paymentMethod._id || paymentMethod.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPaymentMethod ===
                    (paymentMethod._id || paymentMethod.id)
                      ? "border-[#3F205F] bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={paymentMethod._id || paymentMethod.id}
                        checked={
                          selectedPaymentMethod ===
                          (paymentMethod._id || paymentMethod.id)
                        }
                        onChange={(e) => {
                          console.log(
                            "Payment method selected:",
                            e.target.value,
                          );
                          console.log("Payment method object:", paymentMethod);
                          console.log("Payment method _id:", paymentMethod._id);
                          console.log("Payment method id:", paymentMethod.id);
                          setSelectedPaymentMethod(e.target.value);
                        }}
                        className="h-4 w-4 text-[#3F205F] focus:ring-[#3F205F]"
                      />
                      <div className="ml-3">
                        <p className="font-medium">
                          {paymentMethod.type === "card" && paymentMethod.card
                            ? `Card ending in ${paymentMethod.card.last4}`
                            : `Bank Account ending in ${paymentMethod.bankAccount?.last4 || "****"}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {paymentMethod.type === "card" && paymentMethod.card
                            ? `Expires ${paymentMethod.card.expMonth}/${paymentMethod.card.expYear}`
                            : paymentMethod.bankAccount?.bankName ||
                              "Bank Account"}
                        </p>
                      </div>
                    </div>
                    {paymentMethod.isDefault && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        Default
                      </span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 space-y-3">
              <p className="text-gray-500 mb-2">Payment method not found.</p>
              <p className="text-sm text-gray-400">
                Create a payment method to continue.
              </p>
              <div>
                <button
                  onClick={() => router.push("/dashboard/payment-method")}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#3F205F] border border-transparent rounded-md hover:bg-[#2D1A4A]"
                >
                  Create Payment Method
                </button>
              </div>
            </div>
          )}

          {/* Navigates to the payment methods page for creating new methods */}
        </div>
      )}

      {/* Review & Confirm */}
      {step === "review" && selectedService && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Review & Confirm</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold">{selectedService.serviceName}</h4>
              <p className="text-sm text-gray-600">
                {selectedService.serviceType}
              </p>
              <p className="text-sm text-gray-600">
                Base price: ${selectedService.price.toFixed(2)}/month
              </p>
            </div>

            {selectedAddOns.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="font-semibold mb-2">Selected Add-ons:</h5>
                {selectedService.addOns
                  .filter((addon) => selectedAddOns.includes(addon._id))
                  .map((addon) => (
                    <div
                      key={addon._id}
                      className="flex justify-between text-sm"
                    >
                      <span>{addon.name}</span>
                      <span>+${addon.price.toFixed(2)}/month</span>
                    </div>
                  ))}
              </div>
            )}

            <div className="p-4 bg-[#3F205F] text-white rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Monthly Cost:</span>
                <span className="text-xl font-bold">
                  ${calculateTotalPrice().toFixed(2)}/month
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h5 className="font-semibold mb-2">Payment Method:</h5>
              {paymentMethods.find(
                (pm) => (pm._id || pm.id) === selectedPaymentMethod,
              ) && (
                <p className="text-sm">
                  {paymentMethods.find(
                    (pm) => (pm._id || pm.id) === selectedPaymentMethod,
                  )?.type === "card"
                    ? `Card ending in ${paymentMethods.find((pm) => (pm._id || pm.id) === selectedPaymentMethod)?.card?.last4}`
                    : `Bank Account ending in ${paymentMethods.find((pm) => (pm._id || pm.id) === selectedPaymentMethod)?.bankAccount?.last4}`}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={step === "services" ? onClose : handlePrevStep}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          {step === "services" ? "Cancel" : "Back"}
        </button>

        {step !== "review" ? (
          <button
            onClick={() => {
              console.log("Next button clicked, step:", step);
              console.log("Selected payment method:", selectedPaymentMethod);
              handleNextStep();
            }}
            disabled={
              (step === "services" && !selectedService) ||
              (step === "payment" && !selectedPaymentMethod)
            }
            className="px-4 py-2 text-sm font-medium text-white bg-[#3F205F] border border-transparent rounded-md hover:bg-[#2D1A4A] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubscribe}
            disabled={subscribing}
            className="px-4 py-2 text-sm font-medium text-white bg-[#3F205F] border border-transparent rounded-md hover:bg-[#2D1A4A] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {subscribing ? "Subscribing..." : "Subscribe Now"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function BuyServiceModal({
  isOpen,
  onClose,
  onSuccess,
}: BuyServiceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            className="absolute inset-0 bg-gray-500 opacity-75"
            onClick={onClose}
          ></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Buy New Service
                </h3>
                <ServiceSelection onClose={onClose} onSuccess={onSuccess} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
