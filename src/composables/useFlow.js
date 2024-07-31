export function useFlow({ loadingStore, tipDialog }) {
  const executeFlow = async ({ checkCondition, steps }) => {
    if (!checkCondition()) {
      tipDialog.open = true;
      return;
    }
    loadingStore.setLoading(true);
    try {
      for (const step of steps) {
        const response = await step.apiCall()
        step.onSuccess(response);
      }
    } catch (error) {
      console.error('Flow execution failed:', error);
      if (steps.onError) {
        steps.onError(error);
      }
    } finally {
      loadingStore.setLoading(false);
    }
  };

  return {
    executeFlow,
  };
}
