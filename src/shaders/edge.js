// Edge line shaders — faint connection with traveling signal glow

export const edgeVertexShader = /* glsl */`
  attribute float aProgress;   // 0.0 at source, 1.0 at destination
  attribute vec3  aColorA;     // source node color
  attribute vec3  aColorB;     // destination node color

  varying float vProgress;
  varying vec3  vColorA;
  varying vec3  vColorB;

  void main() {
    vProgress = aProgress;
    vColorA   = aColorA;
    vColorB   = aColorB;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const edgeFragmentShader = /* glsl */`
  uniform float uTime;
  uniform float uSignalPos;    // 0→1 position of traveling signal
  uniform float uSignalActive; // 0 or 1
  uniform float uHighlight;    // 0→1 when edge is highlighted

  varying float vProgress;
  varying vec3  vColorA;
  varying vec3  vColorB;

  void main() {
    // Base edge: barely visible thread
    vec3 baseColor = mix(vColorA, vColorB, vProgress) * 0.15;
    float baseAlpha = 0.06 + uHighlight * 0.2;

    // Signal particle traveling along the edge
    float distToSignal = abs(vProgress - uSignalPos);
    float signalGlow = exp(-distToSignal * 28.0) * uSignalActive;

    // Signal color: source color → warm white/gold at midpoint → dest color
    float mid = abs(vProgress - 0.5) * 2.0; // 0 at center, 1 at ends
    vec3 signalColor = mix(
      vec3(1.0, 0.95, 0.7),             // warm white/gold at center of signal
      mix(vColorA, vColorB, vProgress),  // node color at edges
      smoothstep(0.0, 0.6, mid)
    );

    vec3 finalColor = baseColor + signalColor * signalGlow;
    float finalAlpha = baseAlpha + signalGlow * 0.95;

    // Highlight shimmer
    float shimmer = sin(vProgress * 20.0 - uTime * 4.0) * 0.5 + 0.5;
    finalColor += mix(vColorA, vColorB, vProgress) * shimmer * uHighlight * 0.12;

    gl_FragColor = vec4(finalColor, clamp(finalAlpha, 0.0, 1.0));
  }
`
