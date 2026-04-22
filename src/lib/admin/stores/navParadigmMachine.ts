export type NavParadigm = 'sidebar' | 'drawer' | 'hybrid' | 'none';

export type NavStatus = 'idle' | 'switching' | 'previewing';

export interface NavParadigmState {
  current: NavParadigm;
  previous: NavParadigm;
  status: NavStatus;
  target: NavParadigm | null;
  previewRoute: string | null;
}

export type NavParadigmEvent =
  | { type: 'SWITCH'; to: NavParadigm }
  | { type: 'TRANSITION_END' }
  | { type: 'PREVIEW'; route: string }
  | { type: 'EXIT_PREVIEW' };

type Subscriber = (state: NavParadigmState) => void;

export function createNavParadigmMachine(initial: NavParadigm = 'hybrid') {
  let state: NavParadigmState = {
    current: initial,
    previous: initial,
    status: 'idle',
    target: null,
    previewRoute: null,
  };

  const subscribers = new Set<Subscriber>();

  function notify() {
    for (const sub of subscribers) {
      sub(state);
    }
  }

  function setStatus(newStatus: NavStatus) {
    if (state.status !== newStatus) {
      state = { ...state, status: newStatus };
      notify();
    }
  }

  return {
    getState(): Readonly<NavParadigmState> {
      return state;
    },

    send(event: NavParadigmEvent): void {
      switch (event.type) {
        case 'SWITCH': {
          if (event.to === state.current) return;
          state = {
            ...state,
            previous: state.current,
            target: event.to,
            status: 'switching',
          };
          notify();
          break;
        }

        case 'TRANSITION_END': {
          if (state.status === 'switching' && state.target) {
            state = {
              ...state,
              current: state.target,
              target: null,
              status: state.previewRoute ? 'previewing' : 'idle',
            };
            notify();
          }
          break;
        }

        case 'PREVIEW': {
          state = {
            ...state,
            previewRoute: event.route,
            status: state.status === 'switching' ? 'switching' : 'previewing',
          };
          notify();
          break;
        }

        case 'EXIT_PREVIEW': {
          state = {
            ...state,
            previewRoute: null,
            status: 'idle',
          };
          notify();
          break;
        }
      }
    },

    subscribe(callback: Subscriber): () => void {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    },
  };
}
