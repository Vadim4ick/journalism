export interface SiteSettings {
  site_id: string;
  is_public_part_closed: boolean;
  organization: {
    full_name: string;
    short_name: string;
    logo: {
      id: number;
      path: string;
    }[];
    requisites: string;
    management: {
      director: string;
      deputy_director: string;
    };
    registration: {
      inn: string;
      ogrn: string;
      kpp: string;
      okpo: string;
    };
    founder: {
      name: string;
      email: string;
      phone: string;
      director: string;
    };
    bank: {
      name: string | null;
      bik: string | null;
      account: string | null;
      correspondent_account: string | null;
    };
  };
  contacts: {
    address: string;
    email: string;
    phones: {
      value: string;
    }[];
    work_hours: string;
    map_url: string | null;
  };
  socials: {
    type: string;
    value: string;
  }[];
  feedback: {
    enabled: boolean;
    smartcaptcha_client_key: string;
  };
  analytics: {
    yandex_metrika_id: string;
  };
}

export type SiteSettingsResponse = ApiSuccessResponse<SiteSettings>;
