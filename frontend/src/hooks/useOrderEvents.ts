import { useEffect, useRef, useState } from "react";

import type { Order } from "../types/order";

import {
  createOrderEventSource,
  parseOrderEvent,
} from "../services/sseService";

import type { ConnectionState } from "../components/common/ConnectionStatus";

interface Options {
  onOrderUpdated?: (order: Order) => void;
  onReconnect?: () => void;
}

function useOrderEvents({ onOrderUpdated, onReconnect }: Options) {
  const [status, setStatus] = useState<ConnectionState>("reconnecting");

  const hasConnectedBefore = useRef(false);

  const reconnectTimer = useRef<number | null>(null);

  const sourceRef = useRef<EventSource | null>(null);

  const onOrderUpdatedRef = useRef(onOrderUpdated);
  const onReconnectRef = useRef(onReconnect);

  useEffect(() => {
    onOrderUpdatedRef.current = onOrderUpdated;
    onReconnectRef.current = onReconnect;
  }, [onOrderUpdated, onReconnect]);

  useEffect(() => {
    let cancelled = false;

    function connect() {
      if (cancelled) {
        return;
      }

      setStatus("reconnecting");

      const source = createOrderEventSource();

      sourceRef.current = source;

      source.onopen = () => {
        if (cancelled) {
          return;
        }

        const wasPreviouslyConnected = hasConnectedBefore.current;

        hasConnectedBefore.current = true;

        setStatus("connected");
        if (wasPreviouslyConnected) {
          onReconnectRef.current?.();
        }
      };

      source.addEventListener("connected", () => {
        if (!cancelled) {
          setStatus("connected");
        }
      });

      source.addEventListener("order.updated", (event) => {
        const parsed = parseOrderEvent(event as MessageEvent);

        if (!parsed) {
          return;
        }

        onOrderUpdatedRef.current?.(parsed.data);
      });

      source.onerror = () => {
        if (cancelled) {
          return;
        }

        setStatus("reconnecting");

        source.close();

        if (reconnectTimer.current !== null) {
          window.clearTimeout(reconnectTimer.current);
        }

        reconnectTimer.current = window.setTimeout(() => {
          connect();
        }, 3000);
      };
    }

    connect();

    return () => {
      cancelled = true;

      if (reconnectTimer.current !== null) {
        window.clearTimeout(reconnectTimer.current);
      }

      sourceRef.current?.close();

      sourceRef.current = null;
    };
  }, []);

  return {
    status,
  };
}

export default useOrderEvents;
