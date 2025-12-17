import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, withState } from '@ngrx/signals';

export type LoadingStatus = 'running' | 'finished' | 'not_started';
export type LoadingState = { loadingStatus: LoadingStatus };

export function withLoadingFeature() {
  return signalStoreFeature(
    withState<LoadingState>({ loadingStatus: 'not_started' }),
    withComputed(({ loadingStatus }) => ({
      loading: computed(() => loadingStatus() === 'running'),
      isFinished: computed(() => loadingStatus() === 'finished'),
    })),
  );
}

export function setLoading(): LoadingState {
  return { loadingStatus: 'running' };
}

export function setLoadingFinished(): LoadingState {
  return { loadingStatus: 'finished' };
}
