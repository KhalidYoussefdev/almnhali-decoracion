interface MoyasarInitConfig {
  element: string;
  amount: number;
  currency: string;
  description: string;
  publishable_api_key: string;
  callback_url: string;
  methods: string[];
  supported_networks?: string[];
  metadata?: Record<string, string>;
  on_completed?: (payment: { id: string; status: string; metadata?: Record<string, string> }) => Promise<void>;
}

interface MoyasarGlobal {
  init: (config: MoyasarInitConfig) => void;
}

interface Window {
  Moyasar?: MoyasarGlobal;
}