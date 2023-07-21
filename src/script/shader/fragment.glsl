 uniform vec2 uResolution;
 uniform vec2 uImageResolution;
 uniform vec2 uCenter;
 uniform float uChangeTransition;
 uniform float uPower;
 uniform sampler2D uTexture;
 uniform sampler2D uNextTexture;
 uniform sampler2D disp;

 varying vec2 vUv;


const float strength = 1.0;

vec2 bulge(vec2 uv, vec2 center) {
  uv -= center;
  
  float dist = length(uv);
  float distPow = pow(dist, uPower);
  uv *= distPow; 
  
  uv += center;

  return uv;
}


void main(void) {
    vec2 ratio = vec2(
        min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
        min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
    );

    vec2 uv = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

     float intensity = 0.2;

    vec4 disp = texture2D(disp, uv);
    vec2 dispVec = vec2(disp.x, disp.y);

     vec2 bulgeUV = bulge(uv, uCenter);

    vec2 distPos1 = bulgeUV + (dispVec * intensity * uChangeTransition);
    vec2 distPos2 = bulgeUV + (dispVec * -(intensity * (3.0 - ( 3.0 * uChangeTransition))));

  
    vec4 texColor = texture2D(uTexture, distPos1);
    vec4 texColorNext = texture2D(uNextTexture, distPos2);
    vec4 finalTexture = mix(texColor, texColorNext, uChangeTransition);

    gl_FragColor = finalTexture;
}