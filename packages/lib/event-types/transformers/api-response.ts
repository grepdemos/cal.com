import {
  BookingWindowPeriodInputTypeEnum_2024_06_14,
  BookingWindowPeriodOutputTypeEnum_2024_06_14,
  BookingLimitsEnum_2024_06_14,
  BookerLayoutsInputEnum_2024_06_14,
  BookerLayoutsOutputEnum_2024_06_14,
  ConfirmationPolicyEnum,
  Frequency,
  FrequencyInput,
} from "@calcom/platform-enums/monorepo";
import type {
  AddressLocation_2024_06_14,
  IntegrationLocation_2024_06_14,
  LinkLocation_2024_06_14,
  PhoneLocation_2024_06_14,
  Integration_2024_06_14,
  BookingLimitsKeysInputType,
  TransformBookingLimitsSchema_2024_06_14,
  TransformFutureBookingsLimitSchema_2024_06_14,
  BookingWindow_2024_06_14,
  RangeWindow_2024_06_14,
  CalendarDaysWindow_2024_06_14,
  BusinessDaysWindow_2024_06_14,
  BookingField_2024_06_14,
  NoticeThresholdTransformedSchema,
  ConfirmationPolicy_2024_06_14,
  BookerLayoutsTransformedSchema,
  EventTypeColorsTransformedSchema,
  EventTypeColor_2024_06_14,
  Recurrence_2024_06_14,
  TransformRecurringEventSchema_2024_06_14,
  SeatOptionsTransformedSchema,
  SeatOptionsDisabledSchema,
  CreateEventTypeInput_2024_06_14,
} from "@calcom/platform-types";
import type { Disabled_2024_06_14 } from "@calcom/platform-types/event-types/event-types_2024_06_14/inputs/disabled.input";

import type { transformApiEventTypeBookingFields, transformApiEventTypeLocations } from "./api-request";

const reverseIntegrationsMapping: Record<string, Integration_2024_06_14> = {
  "integrations:daily": "cal-video",
};

function getResponseEventTypeLocations(
  transformedLocations: ReturnType<typeof transformApiEventTypeLocations>
) {
  if (!transformedLocations) {
    return [];
  }

  return transformedLocations.map((location) => {
    switch (location.type) {
      case "inPerson": {
        if (!location.address) {
          throw new Error("Address location must have an address");
        }
        const addressLocation: AddressLocation_2024_06_14 = {
          type: "address",
          address: location.address,
          public: location.displayLocationPublicly,
        };
        return addressLocation;
      }
      case "link": {
        if (!location.link) {
          throw new Error("Link location must have a link");
        }
        const linkLocation: LinkLocation_2024_06_14 = {
          type: "link",
          link: location.link,
          public: location.displayLocationPublicly,
        };
        return linkLocation;
      }
      case "userPhone": {
        if (!location.hostPhoneNumber) {
          throw new Error("Phone location must have a phone number");
        }
        const phoneLocation: PhoneLocation_2024_06_14 = {
          type: "phone",
          phone: location.hostPhoneNumber,
          public: location.displayLocationPublicly,
        };
        return phoneLocation;
      }
      default: {
        const integrationType = reverseIntegrationsMapping[location.type];
        if (!integrationType) {
          throw new Error(`Unsupported integration type '${location.type}'.`);
        }
        const integration: IntegrationLocation_2024_06_14 = {
          type: "integration",
          integration: integrationType,
        };
        return integration;
      }
    }
  });
}

function getResponseEventTypeBookingFields(
  transformedBookingFields: ReturnType<typeof transformApiEventTypeBookingFields>
): BookingField_2024_06_14[] {
  if (!transformedBookingFields) {
    return [];
  }

  return transformedBookingFields.map((field) => {
    switch (field.type) {
      case "name":
        return {
          type: field.type,
          slug: field.name,
          label: field.label,
          required: field.required,
          placeholder: field.placeholder,
        };
      case "email":
        return {
          type: field.type,
          slug: field.name,
          label: field.label,
          required: field.required,
          placeholder: field.placeholder,
        };
      case "phone":
        return {
          type: field.type,
          slug: field.name,
          label: field.label,
          required: field.required,
          placeholder: field.placeholder,
        };
      case "address":
        return {
          type: field.type,
          slug: field.name,
          label: field.label,
          required: field.required,
          placeholder: field.placeholder,
        };
      case "text":
        return {
          type: field.type,
          slug: field.name,
          label: field.label,
          required: field.required,
          placeholder: field.placeholder,
        };
      case "number":
        return {
          type: field.type,
          slug: field.name,
          label: field.label,
          required: field.required,
          placeholder: field.placeholder,
        };
      case "textarea":
        return {
          type: field.type,
          slug: field.name,
          label: field.label,
          required: field.required,
          placeholder: field.placeholder,
        };
      case "multiemail":
        return {
          type: field.type,
          slug: field.name,
          label: field.label,
          required: field.required,
          placeholder: field.placeholder,
        };
      case "boolean":
        return {
          type: field.type,
          slug: field.name,
          label: field.label,
          required: field.required,
        };
      case "select":
        return {
          type: field.type,
          slug: field.name,
          label: field.label,
          required: field.required,
          placeholder: field.placeholder,
          options: field.options ? field.options.map((option) => option.value) : [],
        };
      case "multiselect":
        return {
          type: field.type,
          slug: field.name,
          label: field.label,
          required: field.required,
          options: field.options ? field.options?.map((option) => option.value) : [],
        };
      case "checkbox":
        return {
          type: field.type,
          slug: field.name,
          label: field.label,
          required: field.required,
          options: field.options ? field.options?.map((option) => option.value) : [],
        };
      case "radio":
        return {
          type: field.type,
          slug: field.name,
          label: field.label,
          required: field.required,
          options: field.options ? field.options?.map((option) => option.value) : [],
        };
      default:
        throw new Error(`Unsupported booking field type '${field.type}'.`);
    }
  });
}

function getResponseEventTypeIntervalLimits(
  transformedBookingFields: TransformBookingLimitsSchema_2024_06_14 | null
) {
  if (!transformedBookingFields) {
    return undefined;
  }
  const res: { [K in BookingLimitsKeysInputType]?: number } = {};
  transformedBookingFields &&
    Object.entries(transformedBookingFields).map(([key, value]) => {
      const outputKey: BookingLimitsKeysInputType | undefined = Object.keys(
        BookingLimitsEnum_2024_06_14
      ).find(
        (item) => BookingLimitsEnum_2024_06_14[item as keyof typeof BookingLimitsEnum_2024_06_14] === key
      ) as BookingLimitsKeysInputType;

      if (outputKey) {
        res[outputKey] = value as number;
      }
    });
  return res;
}

function getResponseEventTypeFutureBookingLimits(
  transformedFutureBookingsLimitsFields: TransformFutureBookingsLimitSchema_2024_06_14
): BookingWindow_2024_06_14 | undefined {
  switch (transformedFutureBookingsLimitsFields?.periodType) {
    case BookingWindowPeriodOutputTypeEnum_2024_06_14.RANGE:
      return {
        type: BookingWindowPeriodInputTypeEnum_2024_06_14.range,
        value: [
          transformedFutureBookingsLimitsFields?.periodStartDate?.toISOString().split("T")[0],
          transformedFutureBookingsLimitsFields?.periodEndDate?.toISOString().split("T")[0],
        ],
      } as RangeWindow_2024_06_14;
    case BookingWindowPeriodOutputTypeEnum_2024_06_14.ROLLING_WINDOW:
      return {
        type: transformedFutureBookingsLimitsFields.periodCountCalendarDays
          ? BookingWindowPeriodInputTypeEnum_2024_06_14.calendarDays
          : BookingWindowPeriodInputTypeEnum_2024_06_14.businessDays,
        value: transformedFutureBookingsLimitsFields.periodDays,
        rolling: true,
      } as CalendarDaysWindow_2024_06_14 | BusinessDaysWindow_2024_06_14;
    case BookingWindowPeriodOutputTypeEnum_2024_06_14.ROLLING:
      return {
        type: transformedFutureBookingsLimitsFields.periodCountCalendarDays
          ? BookingWindowPeriodInputTypeEnum_2024_06_14.calendarDays
          : BookingWindowPeriodInputTypeEnum_2024_06_14.businessDays,
        value: transformedFutureBookingsLimitsFields.periodDays,
        rolling: false,
      } as CalendarDaysWindow_2024_06_14 | BusinessDaysWindow_2024_06_14;

    case BookingWindowPeriodOutputTypeEnum_2024_06_14.UNLIMITED:
      return {
        disabled: true,
      } as Disabled_2024_06_14;
    default:
      return undefined;
  }
}

function getResponseEventTypeBookerLayouts(transformedBookerLayouts: BookerLayoutsTransformedSchema) {
  const outputToInputMap = {
    [BookerLayoutsOutputEnum_2024_06_14.month_view]: BookerLayoutsInputEnum_2024_06_14.month,
    [BookerLayoutsOutputEnum_2024_06_14.week_view]: BookerLayoutsInputEnum_2024_06_14.week,
    [BookerLayoutsOutputEnum_2024_06_14.column_view]: BookerLayoutsInputEnum_2024_06_14.column,
  };

  return {
    defaultLayout: outputToInputMap[transformedBookerLayouts.defaultLayout],
    enabledLayouts: transformedBookerLayouts.enabledLayouts.map((layout) => outputToInputMap[layout]),
  };
}

function getResponseEventTypeRequiresConfirmation(
  requiresConfirmation: boolean,
  requiresConfirmationThreshold: NoticeThresholdTransformedSchema,
  requiresConfirmationWillBlockSlot: boolean
): ConfirmationPolicy_2024_06_14 | undefined {
  if (requiresConfirmationThreshold?.unit) {
    return {
      type: ConfirmationPolicyEnum.TIME,
      noticeThreshold: {
        unit: requiresConfirmationThreshold.unit,
        count: requiresConfirmationThreshold.time,
      },
      blockUnconfirmedBookingsInBooker: requiresConfirmationWillBlockSlot,
    };
  } else if (requiresConfirmation) {
    return {
      type: ConfirmationPolicyEnum.ALWAYS,
      blockUnconfirmedBookingsInBooker: requiresConfirmationWillBlockSlot,
    };
  } else if (!requiresConfirmationWillBlockSlot && !requiresConfirmation) {
    return {
      disabled: true,
    };
  }
  return undefined;
}

function getResponseEventTypeColors(
  transformedColors: EventTypeColorsTransformedSchema
): EventTypeColor_2024_06_14 {
  return {
    darkThemeHex: transformedColors.darkEventTypeColor,
    lightThemeHex: transformedColors.lightEventTypeColor,
  };
}

function getResponseSeatOptions(
  transformedSeats: SeatOptionsTransformedSchema | SeatOptionsDisabledSchema
): CreateEventTypeInput_2024_06_14["seats"] {
  if (transformedSeats.seatsPerTimeSlot == null) {
    return {
      disabled: true,
    };
  }
  return {
    seatsPerTimeSlot: transformedSeats.seatsPerTimeSlot,
    showAttendeeInfo: transformedSeats.seatsShowAttendees,
    showAvailabilityCount: transformedSeats.seatsShowAvailabilityCount,
  };
}

function getResponseEventTypeRecurrence(
  transformRecurringEvent: TransformRecurringEventSchema_2024_06_14
): Recurrence_2024_06_14 {
  return {
    interval: transformRecurringEvent.interval,
    occurrences: transformRecurringEvent.count,
    frequency: FrequencyInput[Frequency[transformRecurringEvent.freq] as keyof typeof FrequencyInput],
  } satisfies Recurrence_2024_06_14;
}

export {
  getResponseEventTypeLocations,
  getResponseEventTypeBookingFields,
  getResponseEventTypeIntervalLimits,
  getResponseEventTypeFutureBookingLimits,
  getResponseEventTypeBookerLayouts,
  getResponseEventTypeRequiresConfirmation,
  getResponseEventTypeColors,
  getResponseSeatOptions,
  getResponseEventTypeRecurrence,
};
