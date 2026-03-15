export const nodeVertexShader = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const nodeFragmentShader = /* glsl */`
  uniform float uTime;
  uniform float uActivation;
  uniform vec3  uColor;
  uniform float uIdlePulse;

  varying vec2 vUv;

  void main() {
    vec2  c    = vUv - 0.5;
    float dist = length(c);

    // ── Solid filled circle ──────────────────────────────────────────────────
    float circle = 1.0 - smoothstep(0.30, 0.35, dist);

    // ── Crisp border ring ────────────────────────────────────────────────────
    float ring = smoothstep(0.28, 0.31, dist) * (1.0 - smoothstep(0.34, 0.36, dist));
    ring = ring * 1.5;

    // ── Idle pulse (subtle brightness wave on the fill) ──────────────────────
    float pulse = sin(uTime * 1.8 + uIdlePulse) * 0.5 + 0.5;

    // ── Soft outer glow (simulates bloom) ────────────────────────────────────
    float glow     = 1.0 - smoothstep(0.0, 0.85, dist);
    glow = pow(glow, 3.5) * (0.5 + pulse * 0.2);

    // ── Activation corona ─────────────────────────────────────────────────────
    float corona = 1.0 - smoothstep(0.32, 0.75 + uActivation * 0.25, dist);
    corona = pow(corona, 2.0) * uActivation * 1.2;

    // ── Inner fill color: slightly darker center, brighter edge ──────────────
    float rim  = 1.0 - smoothstep(0.0, 0.30, dist);           // 1 at edge, 0 at center
    vec3  fill = uColor * (0.35 + rim * 0.45 + pulse * 0.08); // darker fill, bright rim

    // ── Compose ───────────────────────────────────────────────────────────────
    vec3  col   = fill * circle
                + uColor * ring * 1.2
                + uColor * glow
                + uColor * corona;

    // White activation flash
    col += vec3(1.0) * uActivation * 0.25 * circle;

    float alpha = circle * 0.92
                + ring   * 0.9
                + glow   * 0.35
                + corona * 0.45;

    alpha = clamp(alpha, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`
