import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, withState } from '@ngrx/signals';

export type LoadingState = { loading: boolean };

export function withLoadingFeature() {
  return signalStoreFeature(
    withState<LoadingState>({ loading: false }),
    withComputed(({ loading }) => ({
      isPending: computed(() => loading()),
      isFulfilled: computed(() => !loading())
    }))
  );
}

export function setLoading(): LoadingState {
  return { loading: true };
}

export function setLoadingFinished() {
  return { loading: false };
}


