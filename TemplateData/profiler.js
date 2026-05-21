let unityProfiler = (function () {
  let intervalId = 0;
  const storageKey = 'UnityPlayerConnectionAddress';
  let profilerButton;

  return {
    createButton: (unityInstance) => {
      profilerButton = document.createElement('button');
      profilerButton.style.cssText = 'background-color: #312912; color: #e8d9a0; border: 2px solid #423718; padding: 5px 12px; cursor: pointer; font-family: "Londrina Solid", cursive; font-size: 16px;';
      profilerButton.innerHTML = unityInstance.IsConnectedToProfiler() ? 'Stop Profiling' : 'Profile';

      const startStatusUpdate = () => {
        if (intervalId === 0)
          intervalId = setInterval(updateProfilingStatus, 1000);
      }

      profilerButton.onclick = () => {
        if (unityInstance.IsConnectedToProfiler()) {
          unityInstance.StopProfiling();
        } else {
          const ipAndPort = prompt(`Please input 'IP:port' of the Unity Profiler.`, localStorage.getItem(storageKey) || '');
          if (ipAndPort) {
            unityInstance.ConnectToProfiler(ipAndPort);
            localStorage.setItem(storageKey, ipAndPort);
            startStatusUpdate();
          }
        }
      };

      const updateProfilingStatus = () => {
        profilerButton.innerHTML = unityInstance.IsConnectedToProfiler() ? 'Stop Profiling' : 'Profile';
      }

      if (unityInstance.IsConnectedToProfiler()) {
        startStatusUpdate();
      }

      return profilerButton;
    },
    shutDown: () => {
      if (profilerButton.parentNode && profilerButton) {
        profilerButton.parentNode.remove(profilerButton);
      }
      clearInterval(intervalId);
      intervalId = 0;
    }
  };
})();
