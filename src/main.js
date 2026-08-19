import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import './style.css';

const canvas = document.querySelector('#scene');
const experience = document.querySelector('.experience');
const loaderElement = document.querySelector('#loader');
const loadBar = document.querySelector('#load-bar');
const loadPercent = document.querySelector('#load-percent');
const animationButton = document.querySelector('#animation-button');
const viewerControls = document.querySelector('#viewer-controls');
const staticHeroRender = document.querySelector('.hero-render');

const localizedContent = {
  en: {
    nav: ['Exo-Core', 'About', 'Request a Demo'],
    heroEyebrow: 'Exoskeleton technologies', heroTitle: '<span class="hero-line">Supporting your work</span><em class="hero-line">Securing your life</em>', heroIntro: 'Wearable assistance for lifting, walking, and repetitive industrial tasks.', discover: 'Discover ExoTechHK <span>↓</span>',
    detailsKicker: 'EXO-CORE', detailsTitle: 'Product facts', detailMeta: ['LIFTING ASSISTANCE','SYSTEM WEIGHT','OPERATING TIME','MEASURED RESULT','TORQUE','BUILT FOR','ASSISTED AREAS','POWER','ASSISTANCE MODES','MATERIALS','SPEED','BATTERY','PROTECTION','CHARGING','CONTROL'], detailTitles: ['28<small>kg</small>','3.8<small>kg</small>','~4.5<small>h</small>','30<small>%</small>','60<small>Nm</small>','Lifting · Walking','Hip Joint ·<br>Lower Back','Active Powered','Followed Lifting · Large Lifting · Walking + Lifting','Carbon Fiber<br>Aerospace-Grade Aluminium<br>ABS Plastic','2000<small>deg/s</small>','90<small>Wh</small>','IP54','~1.5<small>h</small>','On-Exoskeleton Control'], detailDescriptions: ['Assistance','System weight','Operating time','Measured body stress reduction','Combined Peak Assistance Torque','For repetitive, physically demanding work.','Targeted assistance','Powered assistance','Three assistance modes','For industrial workplaces.','Peak Assisted Speed','Battery Capacity','Equivalent Water / Dust Protection','USB Type-C PD 3.0','Integrated Control Panel'], factsNote: '',
    aboutKicker: 'Company / ExoTechHK', aboutTitle: 'About Us', aboutBody: 'ExoTechHK is a robotics startup from The Chinese University of Hong Kong. We develop wearable exoskeletons for physically demanding industrial work.', contactKicker: 'Demo / Pilot', contactTitle: 'Request a Demo', formIntro: 'Tell us about your workplace or pilot requirements.', formFields: ['Name','Email*','Message'], send: 'Discuss a Pilot', contactInfo: 'Contact information', contactLabels: ['Address','Phone'], address: 'Unit 1031, 10/F, Building 19W,<br>No. 19 Science Park West Avenue,<br>Hong Kong Science Park,<br>Pak Shek Kok, N.T., Hong Kong', footerTagline: 'Supporting your work<br>Securing your life', footerLabels: ['Product','Contact','Location'], location: 'Hong Kong Science Park<br>Pak Shek Kok, Hong Kong', copyright: 'Copyright © 2025 ExoTechHK - All Rights Reserved.', loader: 'Initializing exoskeleton'
  },
  'zh-HK': {
    nav: ['Exo-Core', '關於我們', '預約示範'],
    heroEyebrow: 'EXOSKELETON TECHNOLOGIES', heroTitle: '<span class="hero-line">助力工作，</span><em class="hero-line">守護生活。</em>', heroIntro: '為抬升、行走及重複工業工作提供穿戴式助力。', discover: '探索 EXOTECHK <span>↓</span>',
    detailsKicker: 'EXO-CORE', detailsTitle: '產品重點', detailMeta: ['抬升助力','系統重量','運作時間','實測結果','扭矩','適用工作','輔助部位','動力','助力模式','材料','速度','電池','防護','充電','控制'], detailTitles: ['28<small>公斤</small>','3.8<small>公斤</small>','~4.5<small>小時</small>','30<small>%</small>','60<small>Nm</small>','抬升 · 行走','髖關節 ·<br>腰背','主動動力','跟隨抬升 · 大力抬升 · 行走 + 抬升','碳纖維<br>航太級鋁材<br>ABS 塑膠','2000<small>度/秒</small>','90<small>Wh</small>','IP54','~1.5<small>小時</small>','外骨骼機身控制'], detailDescriptions: ['助力','系統重量','運作時間','實測身體壓力降低','綜合峰值助力扭矩','適合重複及高體力需求工作。','針對性助力','動力輔助','三種助力模式','適用於工業工作環境。','峰值輔助速度','電池容量','同等防水／防塵保護','USB Type-C PD 3.0','整合式控制面板'], factsNote: '',
    aboutKicker: '公司 / ExoTechHK', aboutTitle: '關於我們', aboutBody: 'ExoTechHK 是源自香港中文大學的機器人初創公司，專注研發適用於高體力需求工業工作的穿戴式外骨骼。', contactKicker: '示範 / 試點', contactTitle: '預約示範', formIntro: '歡迎告訴我們您的工作場景或試點需求。', formFields: ['姓名','電郵*','訊息'], send: '洽談試點', contactInfo: '聯絡資料', contactLabels: ['地址','電話'], address: '香港特別行政區 新界 白石角<br>香港科學園 19W大樓 10樓 1031室', footerTagline: '助力工作，<br>守護生活。', footerLabels: ['產品','聯絡','地點'], location: '香港科學園<br>香港白石角', copyright: 'Copyright © 2025 ExoTechHK - All Rights Reserved.', loader: '正在初始化外骨骼'
  }
};

const setHTML = (selector, value) => { const element = document.querySelector(selector); if (element) element.innerHTML = value; };
const setHTMLList = (selector, values) => document.querySelectorAll(selector).forEach((element, index) => { if (values[index] != null) element.innerHTML = values[index]; });
function applyLanguage(language) {
  const copy = localizedContent[language] ?? localizedContent.en;
  document.documentElement.lang = language;
  document.body.dataset.language = language;
  setHTMLList('.mini-nav a', copy.nav); setHTML('.hero .eyebrow', copy.heroEyebrow); setHTML('.hero h1', copy.heroTitle); setHTML('.hero .intro', copy.heroIntro); setHTML('.scroll-cue', copy.discover);
  const visibleFactIndices = [0,1,2,3,5,6,7,9,13];
  setHTML('.exocore-details-heading .kicker', language === 'zh-HK' ? '穿戴式外骨骼' : 'Wearable exoskeleton'); setHTML('.exocore-details-heading h2', 'EXO-CORE'); setHTML('.exocore-details-heading > p', language === 'zh-HK' ? '抬升與行走穿戴式助力' : 'Wearable assistance for lifting and walking'); setHTMLList('.exocore-detail-fact > span', visibleFactIndices.map((index) => copy.detailMeta[index])); setHTMLList('.exocore-detail-fact h3', visibleFactIndices.map((index) => copy.detailTitles[index])); setHTMLList('.exocore-detail-fact p', visibleFactIndices.map((index) => copy.detailDescriptions[index])); setHTML('.exocore-detail-fact > small', copy.factsNote);
  setHTML('.exocore-detail-fact:nth-child(4) h3', '30<small>%</small>');
  if (language === 'zh-HK') setHTML('.exocore-detail-fact:nth-child(8) h3', '碳纖維　航太級鋁材　ABS 塑膠');
  setHTML('.about .kicker', copy.aboutKicker); setHTML('.about h2', copy.aboutTitle); setHTML('.about > p', copy.aboutBody); setHTML('.contact-heading .kicker', copy.contactKicker); setHTML('.contact h2', copy.contactTitle); setHTML('.contact-form > p', copy.formIntro); document.querySelectorAll('.contact-form input,.contact-form textarea').forEach((field,index) => field.placeholder = copy.formFields[index]); setHTML('.contact-form button', copy.send); setHTML('.contact address h3', copy.contactInfo); setHTMLList('.contact address span', copy.contactLabels); setHTML('.contact address div:first-of-type p', copy.address); setHTML('footer > div:first-child p', copy.footerTagline); setHTMLList('footer > div:not(:first-child) > span', copy.footerLabels); setHTML('footer > div:nth-child(4) p', copy.location); setHTML('footer small', copy.copyright);
  if (!loaderElement.classList.contains('is-hidden')) setHTML('.loader-copy > span', copy.loader);
  document.querySelectorAll('[data-language]').forEach((button) => { button.classList.toggle('active', button.dataset.language === language); button.setAttribute('aria-pressed', button.dataset.language === language); });
  localStorage.setItem('exotech-language', language);
}

const savedLanguage = localStorage.getItem('exotech-language');
const initialLanguage = savedLanguage === 'en' || savedLanguage === 'zh-HK' ? savedLanguage : (navigator.language.toLowerCase().startsWith('zh') ? 'zh-HK' : 'en');
document.querySelectorAll('[data-language]').forEach((button) => button.addEventListener('click', () => applyLanguage(button.dataset.language)));
applyLanguage(initialLanguage);

if (staticHeroRender) {
  loaderElement.classList.add('is-hidden');
  canvas.setAttribute('aria-hidden', 'true');
}

document.querySelector('#contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const subject = `Website enquiry from ${form.get('name') || 'ExoTechHK visitor'}`;
  const body = `Name: ${form.get('name') || ''}\nEmail: ${form.get('email') || ''}\n\n${form.get('message') || ''}`;
  window.location.href = `mailto:general@exotechhk.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.01, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.58;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
scene.environmentIntensity = 0.65;
new RGBELoader().load(
  new URL('../assets/studio_small_08_1k.hdr', import.meta.url).href,
  (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
  },
  undefined,
  (error) => console.error('Unable to load studio HDR environment.', error),
);

function createBlackRoughnessNoise(size = 256) {
  const data = new Uint8Array(size * size * 4);
  const hash = (x, y, seed) => {
    const value = Math.sin(x * 127.1 + y * 311.7 + seed * 91.3) * 43758.5453;
    return value - Math.floor(value);
  };
  const fade = (value) => value * value * (3 - 2 * value);
  const noise = (u, v, frequency, seed) => {
    const x = u * frequency;
    const y = v * frequency;
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const tx = fade(x - x0);
    const ty = fade(y - y0);
    const top = THREE.MathUtils.lerp(hash(x0, y0, seed), hash(x0 + 1, y0, seed), tx);
    const bottom = THREE.MathUtils.lerp(hash(x0, y0 + 1, seed), hash(x0 + 1, y0 + 1, seed), tx);
    return THREE.MathUtils.lerp(top, bottom, ty);
  };
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = x / size;
      const v = y / size;
      const value = noise(u, v, 6, 1) * 0.6 + noise(u, v, 15, 2) * 0.3 + noise(u, v, 32, 3) * 0.1;
      const channel = Math.round((0.9 + value * 0.1) * 255);
      const index = (y * size + x) * 4;
      data.set([channel, channel, channel, 255], index);
    }
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.colorSpace = THREE.NoColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

const blackRoughnessNoise = createBlackRoughnessNoise();

function createBlackNoiseNormalMap(size = 256) {
  const heights = new Float32Array(size * size);
  const hash = (x, y, seed) => {
    const value = Math.sin(x * 127.1 + y * 311.7 + seed * 67.9) * 43758.5453;
    return value - Math.floor(value);
  };
  const fade = (value) => value * value * (3 - 2 * value);
  const sampleNoise = (u, v, frequency, seed) => {
    const x = u * frequency;
    const y = v * frequency;
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const tx = fade(x - x0);
    const ty = fade(y - y0);
    const a = THREE.MathUtils.lerp(hash(x0, y0, seed), hash(x0 + 1, y0, seed), tx);
    const b = THREE.MathUtils.lerp(hash(x0, y0 + 1, seed), hash(x0 + 1, y0 + 1, seed), tx);
    return THREE.MathUtils.lerp(a, b, ty);
  };

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = x / size;
      const v = y / size;
      heights[y * size + x] =
        sampleNoise(u, v, 7, 11) * 0.52
        + sampleNoise(u, v, 17, 23) * 0.3
        + sampleNoise(u, v, 39, 37) * 0.18;
    }
  }

  const data = new Uint8Array(size * size * 4);
  const heightAt = (x, y) => heights[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = (heightAt(x + 1, y) - heightAt(x - 1, y)) * 14;
      const dy = (heightAt(x, y + 1) - heightAt(x, y - 1)) * 14;
      const normal = new THREE.Vector3(-dx, -dy, 1).normalize();
      const index = (y * size + x) * 4;
      data[index] = Math.round((normal.x * 0.5 + 0.5) * 255);
      data[index + 1] = Math.round((normal.y * 0.5 + 0.5) * 255);
      data[index + 2] = Math.round((normal.z * 0.5 + 0.5) * 255);
      data[index + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.colorSpace = THREE.NoColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

const blackNoiseNormalMap = createBlackNoiseNormalMap();

function createVisibleBlackGrain(size = 128) {
  const data = new Uint8Array(size * size * 4);
  let seed = 2463534242;
  const random = () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return (seed >>> 0) / 4294967295;
  };
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const fine = random();
      const fleck = random() > 0.965 ? random() * 0.35 : 0;
      const value = THREE.MathUtils.clamp(0.48 + fine * 0.42 + fleck, 0, 1);
      const channel = Math.round(value * 255);
      const index = (y * size + x) * 4;
      data.set([channel, channel, channel, 255], index);
    }
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.5, 1.5);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return texture;
}

const visibleBlackGrain = createVisibleBlackGrain();


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.055;
controls.autoRotate = false;
controls.enablePan = false;
controls.enableRotate = false;
controls.enableZoom = false;
controls.maxPolarAngle = Math.PI * 0.5;

const keyLight = new THREE.SpotLight(0xf1f5ff, 1.22);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.bias = -0.0002;
keyLight.angle = THREE.MathUtils.degToRad(52);
keyLight.penumbra = 0.92;
keyLight.decay = 1.15;
scene.add(keyLight);
scene.add(keyLight.target);
const fillLight = new THREE.HemisphereLight(0x6fa9df, 0x06101d, 0);
const rimLight = new THREE.SpotLight(0x8ec4ff, 1.08);
rimLight.angle = THREE.MathUtils.degToRad(52);
rimLight.penumbra = 0.92;
rimLight.decay = 1.2;
const backgroundLeftLight = new THREE.SpotLight(0xe7f1ff, 0.92);
const backgroundRightLight = new THREE.SpotLight(0x559eff, 0.78);
[backgroundLeftLight, backgroundRightLight].forEach((light) => {
  light.angle = THREE.MathUtils.degToRad(54);
  light.penumbra = 0.94;
  light.decay = 1.15;
  scene.add(light, light.target);
});
scene.add(fillLight, rimLight, rimLight.target);

let model;
let mixer;
let contactGlow;
const blackPlasticMaterials = new Set();
const blackMaterialBindings = [];
const cleanBlackMaterials = new Set();
const textureDiagnostics = { visualizeRoughness: false, visualizeNormal: false };
const vestMaterials = new Set();
const modelMaterials = new Set();
let modelRadius = 1;
let modelHeight = 1;
let modelTarget = new THREE.Vector3();
let modelBoundsHelper;
let lightHelpers = [];
let homePosition = new THREE.Vector3();
let homeTarget = new THREE.Vector3();
const normalizePartName = (name = '') => name.toLowerCase().replace(/[^a-z0-9]/g, '');
const hiddenParts = new Set([
  'Exo2.1_ASM - Core_ASM-1 Motor_Enclosure_Outside-6',
].map(normalizePartName));

const renderDefaults = {
  blueTintAmount: 0.25,
  environment: 0.65, hdriRotation: 0, environmentSoftness: 0, exposure: 0.58,
  blackBrightness: 0.025, blackRoughness: 0.76, blackMetalness: 0.39,
  blackReflections: 0.7, clearcoat: 0.15, clearcoatRoughness: 0.61, blackNormal: 1, blackNoise: 0.07,
  useOriginalBlackMaterial: false,
  cleanBlackMetalness: 0, cleanBlackRoughness: 0.54, cleanBlackReflections: 0.55,
  cleanBlackClearcoat: 0.02, cleanBlackClearcoatRoughness: 0.7,
  cleanTextureMode: 'procedural',
  cleanRoughnessTextureStrength: 0.4, cleanRoughnessTextureScale: 22,
  cleanNormalTextureStrength: 0.065, cleanNormalTextureScale: 37,
  cleanBaseVariationStrength: 0.03, cleanBaseVariationScale: 160,
  vestBrightness: 0.46, vestSaturation: 0.98, vestRoughness: 1.6, vestReflections: 0.95, vestNormal: 1.3,
  vestTextureStrength: 0.092, vestTextureScale: 160,
  keyEnabled: true, keyIntensity: 0.42, keySize: 1, keyX: 1.5, keyY: 2.4, keyZ: 1.8,
  fillEnabled: false, fillIntensity: 0.15, fillSize: 2, fillX: 0.5, fillY: 0.4, fillZ: 1.6,
  rimEnabled: true, rimIntensity: 0.16, rimSize: 3.2, rimX: 1.4, rimY: 1.2, rimZ: -1.8,
  glowIntensity: 1, glowX: 74, glowY: 46, glowSize: 72, glowSaturation: 1, backgroundBrightness: 1,
  shadowOpacity: 0.62, shadowSoftness: 1.15, shadowScale: 1.08,
  hdriOnly: true, directOnly: false, disableNormals: false, disableRoughness: false,
  wireframe: false, lightHelpers: false, modelBounds: false,
  lightAIntensity: 1.36, lightAAngle: 56, lightASoftness: 0.94, lightARight: -1.02, lightAUp: 0.92, lightADepth: 1.12, lightATargetRight: 0.18, lightATargetUp: -0.1,
  lightBIntensity: 1.18, lightBAngle: 56, lightBSoftness: 0.94, lightBRight: 1.05, lightBUp: 0.98, lightBDepth: 1.18, lightBTargetRight: -0.2, lightBTargetUp: -0.1,
  lightCIntensity: 1.16, lightCAngle: 58, lightCSoftness: 0.96, lightCRight: 1.28, lightCUp: 0.12, lightCDepth: -1.05, lightCTargetRight: 0, lightCTargetUp: -0.15,
  lightDIntensity: 1.08, lightDAngle: 60, lightDSoftness: 0.96, lightDRight: 1.02, lightDUp: -1.08, lightDDepth: -0.42, lightDTargetRight: -0.14, lightDTargetUp: -0.31,
};
const previousRenderSettings = { ...renderDefaults };
Object.assign(renderDefaults, {
  environment: 0.8,
  hdriRotation: 0,
  environmentSoftness: 0.15,
  exposure: 0.72,
  blackBrightness: 0.055,
  blackRoughness: 0.42,
  blackMetalness: 0,
  blackReflections: 1,
  clearcoat: 0.08,
  clearcoatRoughness: 0.35,
  blackNormal: 0.5,
  blackNoise: 0.02,
  vestBrightness: 0.72,
  vestSaturation: 0.88,
  vestRoughness: 1,
  vestReflections: 0.65,
  vestNormal: 1,
  glowIntensity: 0.45,
  glowX: 72,
  glowY: 45,
  glowSize: 42,
  glowSaturation: 0.75,
  hdriOnly: true,
  directOnly: false,
});
const hdriTestSettings = { ...renderDefaults };
Object.assign(renderDefaults, {
  environment: 0.45,
  exposure: 0.62,
  blackBrightness: 0.018,
  blackRoughness: 0.52,
  blackMetalness: 0,
  blackReflections: 0.55,
  clearcoat: 0.05,
  clearcoatRoughness: 0.45,
  blackNormal: 0.5,
  blackNoise: 0.01,
  vestBrightness: 0.62,
  vestSaturation: 0.9,
  vestRoughness: 1.15,
  vestReflections: 0.55,
  vestNormal: 1,
  glowIntensity: 1,
  glowX: 74,
  glowY: 46,
  glowSize: 72,
  glowSaturation: 1,
  hdriOnly: false,
  directOnly: false,
  keyEnabled: true,
  keyIntensity: 0.7,
  keySize: 6,
  fillEnabled: true,
  fillIntensity: 0.18,
  fillSize: 4.5,
  rimEnabled: true,
  rimIntensity: 0.2,
  rimSize: 4.2,
});
const hybridTestSettings = { ...renderDefaults };
const renderSettings = { ...renderDefaults };
const subtleTextureSettings = {
  cleanTextureMode: 'procedural',
  cleanRoughnessTextureStrength: 0.4,
  cleanRoughnessTextureScale: 22,
  cleanNormalTextureStrength: 0.065,
  cleanNormalTextureScale: 37,
  cleanBaseVariationStrength: 0.03,
  cleanBaseVariationScale: 160,
};
const stressTextureSettings = {
  cleanTextureMode: 'procedural',
  cleanRoughnessTextureStrength: 1,
  cleanRoughnessTextureScale: 64,
  cleanNormalTextureStrength: 0.4,
  cleanNormalTextureScale: 96,
  cleanBaseVariationStrength: 0.08,
  cleanBaseVariationScale: 64,
};

function updateDebugRendering() {
  scene.environmentIntensity = renderSettings.directOnly ? 0 : renderSettings.environment;
  scene.environmentRotation.y = THREE.MathUtils.degToRad(renderSettings.hdriRotation);
  renderer.toneMappingExposure = renderSettings.exposure;

  const directLightsAllowed = !renderSettings.hdriOnly;
  keyLight.visible = directLightsAllowed && renderSettings.keyEnabled;
  keyLight.intensity = renderSettings.lightAIntensity;
  keyLight.angle = THREE.MathUtils.degToRad(renderSettings.lightAAngle);
  keyLight.penumbra = renderSettings.lightASoftness;
  keyLight.shadow.radius = 7;
  fillLight.visible = directLightsAllowed && renderSettings.fillEnabled;
  fillLight.intensity = 0;
  rimLight.visible = directLightsAllowed && renderSettings.rimEnabled;
  rimLight.intensity = renderSettings.lightBIntensity;
  rimLight.angle = THREE.MathUtils.degToRad(renderSettings.lightBAngle);
  rimLight.penumbra = renderSettings.lightBSoftness;
  backgroundLeftLight.intensity = renderSettings.lightCIntensity;
  backgroundLeftLight.angle = THREE.MathUtils.degToRad(renderSettings.lightCAngle);
  backgroundLeftLight.penumbra = renderSettings.lightCSoftness;
  backgroundRightLight.intensity = renderSettings.lightDIntensity;
  backgroundRightLight.angle = THREE.MathUtils.degToRad(renderSettings.lightDAngle);
  backgroundRightLight.penumbra = renderSettings.lightDSoftness;
  backgroundLeftLight.visible = directLightsAllowed;
  backgroundRightLight.visible = directLightsAllowed;

  blackPlasticMaterials.forEach((material) => {
    material.color.setRGB(renderSettings.blackBrightness, renderSettings.blackBrightness, renderSettings.blackBrightness);
    material.roughness = Math.min(1, renderSettings.blackRoughness + renderSettings.environmentSoftness * 0.18);
    material.metalness = renderSettings.blackMetalness;
    material.envMapIntensity = renderSettings.blackReflections;
    if ('clearcoat' in material) {
      material.clearcoat = renderSettings.clearcoat;
      material.clearcoatRoughness = renderSettings.clearcoatRoughness;
    }
    if (material.normalScale && material.userData.originalNormalScale) {
      material.normalScale.copy(material.userData.originalNormalScale).multiplyScalar(renderSettings.blackNormal);
    }
    if (material.userData.tuningShader) {
      material.userData.tuningShader.uniforms.blackNoiseAmount.value = renderSettings.blackNoise;
    }
  });
  cleanBlackMaterials.forEach((material) => {
    material.color.set('#2a2e33').multiplyScalar(material.userData.partTone ?? 1);
    material.metalness = renderSettings.cleanBlackMetalness;
    material.roughness = THREE.MathUtils.clamp(
      renderSettings.cleanBlackRoughness + (material.userData.partRoughnessOffset ?? 0),
      0.05,
      1,
    );
    material.envMapIntensity = renderSettings.cleanBlackReflections;
    material.clearcoat = renderSettings.cleanBlackClearcoat;
    material.clearcoatRoughness = renderSettings.cleanBlackClearcoatRoughness;
    const textureEnabled = renderSettings.cleanTextureMode === 'procedural';
    const grainMap = null;
    if (material.map !== grainMap) {
      material.map = grainMap;
      material.needsUpdate = true;
    }
    material.userData.cleanGrainMap.repeat.setScalar(Math.max(1, renderSettings.cleanBaseVariationScale / 12));
    const smoothNormalMap = textureEnabled ? material.userData.cleanSmoothNormalMap : null;
    if (material.normalMap !== smoothNormalMap) {
      material.normalMap = smoothNormalMap;
      material.needsUpdate = true;
    }
    material.normalScale.setScalar(textureEnabled ? renderSettings.cleanNormalTextureStrength : 0);
    material.userData.cleanSmoothNormalMap.repeat.setScalar(Math.max(1, renderSettings.cleanNormalTextureScale / 12));
    const shader = material.userData.tuningShader;
    if (shader) {
      shader.uniforms.imperfectionEnabled.value = textureEnabled ? 1 : 0;
      shader.uniforms.roughnessVariation.value = renderSettings.cleanRoughnessTextureStrength;
      shader.uniforms.roughnessTextureScale.value = renderSettings.cleanRoughnessTextureScale;
      shader.uniforms.baseVariation.value = renderSettings.cleanBaseVariationStrength;
      shader.uniforms.baseTextureScale.value = renderSettings.cleanBaseVariationScale;
      shader.uniforms.blueTintAmount.value = renderSettings.blueTintAmount;
      shader.uniforms.normalTextureScale.value = renderSettings.cleanNormalTextureScale;
      shader.uniforms.visualizeRoughness.value = textureDiagnostics.visualizeRoughness ? 1 : 0;
      shader.uniforms.visualizeNormal.value = textureDiagnostics.visualizeNormal ? 1 : 0;
    }
  });
  blackMaterialBindings.forEach(({ mesh, materialIndex, original, clean }) => {
    const selected = renderSettings.useOriginalBlackMaterial ? original : clean;
    if (Array.isArray(mesh.material)) mesh.material[materialIndex] = selected;
    else mesh.material = selected;
  });
  const activeTextureState = document.querySelector('[data-active-texture-state]');
  if (activeTextureState) {
    activeTextureState.textContent = renderSettings.useOriginalBlackMaterial
      ? 'Applied: original GLB material'
      : `Applied: ${renderSettings.cleanTextureMode} | color ${renderSettings.cleanBaseVariationStrength.toFixed(3)} @ ${renderSettings.cleanBaseVariationScale} | normal ${renderSettings.cleanNormalTextureStrength.toFixed(3)} @ ${renderSettings.cleanNormalTextureScale} | roughness ${renderSettings.cleanRoughnessTextureStrength.toFixed(3)}`;
  }
  vestMaterials.forEach((material) => {
    material.roughness = Math.min(1, material.userData.originalRoughness * renderSettings.vestRoughness + renderSettings.environmentSoftness * 0.18);
    material.envMapIntensity = renderSettings.vestReflections;
    material.normalScale.copy(material.userData.originalNormalScale).multiplyScalar(renderSettings.vestNormal);
    const shader = material.userData.tuningShader;
    if (shader) {
      shader.uniforms.vestBrightness.value = renderSettings.vestBrightness;
      shader.uniforms.vestSaturation.value = renderSettings.vestSaturation;
      shader.uniforms.vestTextureStrength.value = renderSettings.vestTextureStrength;
      shader.uniforms.vestTextureScale.value = renderSettings.vestTextureScale;
      shader.uniforms.blueTintAmount.value = renderSettings.blueTintAmount;
    }
  });
  modelMaterials.forEach((material) => {
    const normalMap = renderSettings.disableNormals ? null : material.userData.originalNormalMap;
    const roughnessMap = renderSettings.disableRoughness ? null : material.userData.originalRoughnessMap;
    let requiresCompile = false;
    if (material.normalMap !== normalMap) { material.normalMap = normalMap; requiresCompile = true; }
    if (material.roughnessMap !== roughnessMap) { material.roughnessMap = roughnessMap; requiresCompile = true; }
    if (material.wireframe !== renderSettings.wireframe) { material.wireframe = renderSettings.wireframe; requiresCompile = true; }
    if (requiresCompile) material.needsUpdate = true;
  });

  experience.style.setProperty('--glow-opacity', renderSettings.glowIntensity);
  experience.style.setProperty('--glow-x', `${renderSettings.glowX}%`);
  experience.style.setProperty('--glow-y', `${renderSettings.glowY}%`);
  experience.style.setProperty('--glow-size', `${renderSettings.glowSize}%`);
  experience.style.setProperty('--glow-saturation', renderSettings.glowSaturation);
  const backgroundLevel = Math.round(20 * renderSettings.backgroundBrightness);
  experience.style.backgroundColor = `rgb(${backgroundLevel}, ${backgroundLevel + 2}, ${backgroundLevel + 5})`;
  if (contactGlow) {
    contactGlow.material.opacity = renderSettings.shadowOpacity;
    contactGlow.scale.set(
      modelRadius * 0.42 * renderSettings.shadowScale * renderSettings.shadowSoftness,
      modelRadius * 0.24 * renderSettings.shadowScale * renderSettings.shadowSoftness,
      1,
    );
  }
  lightHelpers.forEach((helper) => { helper.visible = renderSettings.lightHelpers; helper.update?.(); });
  if (modelBoundsHelper) modelBoundsHelper.visible = renderSettings.modelBounds;
  updateCrossLightPositions();
}

function updateCrossLightPositions() {
  if (!model || modelRadius <= 0) return;
  const productCenter = modelTarget;
  const cameraToProduct = productCenter.clone().sub(camera.position).normalize();
  const cameraRight = new THREE.Vector3().crossVectors(cameraToProduct, camera.up).normalize();
  const cameraUp = new THREE.Vector3().crossVectors(cameraRight, cameraToProduct).normalize();
  const place = (light, prefix) => {
    light.position.copy(productCenter)
      .addScaledVector(cameraToProduct, modelRadius * renderSettings[`light${prefix}Depth`])
      .addScaledVector(cameraRight, modelRadius * renderSettings[`light${prefix}Right`])
      .addScaledVector(cameraUp, modelRadius * renderSettings[`light${prefix}Up`]);
    light.target.position.copy(productCenter)
      .addScaledVector(cameraRight, modelRadius * renderSettings[`light${prefix}TargetRight`])
      .addScaledVector(cameraUp, modelHeight * renderSettings[`light${prefix}TargetUp`]);
  };
  place(keyLight, 'A');
  place(rimLight, 'B');
  place(backgroundLeftLight, 'C');
  place(backgroundRightLight, 'D');
  lightHelpers.forEach((helper) => helper.update?.());
}

function createDebugControls() {
  if (!new URLSearchParams(location.search).has('debug')) return;
  const storageKey = 'exotechhk-render-tuning-v1';
  const slider = (label, setting, min, max, step) => `<label>${label}<input data-setting="${setting}" type="range" min="${min}" max="${max}" step="${step}" value="${renderDefaults[setting]}"><output>${Number(renderDefaults[setting]).toFixed(2)}</output></label>`;
  const toggle = (label, setting) => `<label class="debug-toggle"><input data-setting="${setting}" type="checkbox" ${renderDefaults[setting] ? 'checked' : ''}>${label}</label>`;
  const select = (label, setting, options) => `<label>${label}<select data-setting="${setting}">${options.map(([value, text]) => `<option value="${value}" ${renderDefaults[setting] === value ? 'selected' : ''}>${text}</option>`).join('')}</select></label>`;
  const panel = document.createElement('aside');
  panel.className = 'render-debug';
  panel.innerHTML = `
    <strong>Render tuning</strong>
    <details open><summary>Environment</summary>${slider('Intensity','environment',0,2,.05)}${slider('HDRI rotation','hdriRotation',0,360,1)}${slider('Softness','environmentSoftness',0,1,.01)}${slider('Exposure','exposure',.3,1.2,.02)}</details>
    <details open><summary>Black material A/B</summary>${toggle('Use Original Black Material','useOriginalBlackMaterial')}<div class="debug-note">Clean test material: #121416, no imported maps</div>${slider('Clean metalness','cleanBlackMetalness',0,1,.01)}${slider('Clean roughness','cleanBlackRoughness',.05,1,.01)}${slider('Clean reflections','cleanBlackReflections',0,2,.05)}${slider('Clean clearcoat','cleanBlackClearcoat',0,.5,.01)}${slider('Clean coat roughness','cleanBlackClearcoatRoughness',0,1,.01)}</details>
    <details open><summary>Clean surface texture / bump</summary>${select('Texture mode','cleanTextureMode',[['off','Off'],['procedural','Procedural']])}${slider('Roughness strength','cleanRoughnessTextureStrength',0,1,.01)}${slider('Roughness scale','cleanRoughnessTextureScale',1,128,1)}${slider('Normal strength','cleanNormalTextureStrength',0,1,.005)}${slider('Normal scale','cleanNormalTextureScale',1,160,1)}${slider('Color texture strength','cleanBaseVariationStrength',0,.3,.002)}${slider('Color texture scale','cleanBaseVariationScale',1,128,1)}<div class="debug-note" data-active-texture-state>Applied texture state loading…</div><div class="debug-texture-views"><label class="debug-toggle"><input data-diagnostic="visualizeRoughness" type="checkbox">Visualize Roughness Texture</label><label class="debug-toggle"><input data-diagnostic="visualizeNormal" type="checkbox">Visualize Normal Texture</label></div><div class="debug-texture-presets"><button data-texture-preset="stress" type="button">Stress test</button><button data-texture-preset="subtle" type="button">Subtle texture</button></div><div class="debug-note">Color texture, normal texture, and roughness are independent channels.</div></details>
    <details><summary>Original black material</summary>${slider('Base brightness','blackBrightness',0,.15,.005)}${slider('Roughness','blackRoughness',.15,1,.01)}${slider('Metalness','blackMetalness',0,1,.01)}${slider('Reflections','blackReflections',0,2,.05)}${slider('Clearcoat','clearcoat',0,.5,.01)}${slider('Coat roughness','clearcoatRoughness',0,1,.01)}${slider('Normal strength','blackNormal',0,2,.05)}${slider('Noise visibility','blackNoise',0,.2,.005)}</details>
    <details><summary>Vest</summary>${slider('Brightness','vestBrightness',.4,1.4,.02)}${slider('Saturation','vestSaturation',0,1.5,.02)}${slider('Roughness ×','vestRoughness',.4,1.6,.02)}${slider('Reflections','vestReflections',0,2,.05)}${slider('Normal strength','vestNormal',0,2,.05)}</details>
    <details><summary>Key light</summary>${toggle('Enabled','keyEnabled')}${slider('Intensity','keyIntensity',0,2,.02)}${slider('Size','keySize',0,10,.1)}${slider('X','keyX',-4,4,.1)}${slider('Y','keyY',-1,5,.1)}${slider('Z','keyZ',-4,4,.1)}</details>
    <details><summary>Fill light</summary>${toggle('Enabled','fillEnabled')}${slider('Intensity','fillIntensity',0,2,.02)}${slider('Size','fillSize',.2,5,.1)}${slider('X','fillX',-4,4,.1)}${slider('Y','fillY',-1,5,.1)}${slider('Z','fillZ',-4,4,.1)}</details>
    <details><summary>Rim light</summary>${toggle('Enabled','rimEnabled')}${slider('Intensity','rimIntensity',0,2,.02)}${slider('Size','rimSize',.2,5,.1)}${slider('X','rimX',-4,4,.1)}${slider('Y','rimY',-1,5,.1)}${slider('Z','rimZ',-4,4,.1)}</details>
    <details><summary>Background</summary>${slider('Glow intensity','glowIntensity',0,2,.02)}${slider('Glow X','glowX',0,100,1)}${slider('Glow Y','glowY',0,100,1)}${slider('Glow size','glowSize',20,140,1)}${slider('Glow saturation','glowSaturation',0,2,.02)}${slider('BG brightness','backgroundBrightness',.3,2,.02)}</details>
    <details><summary>Grounding</summary>${slider('Opacity','shadowOpacity',0,1,.02)}${slider('Softness','shadowSoftness',.5,2,.02)}${slider('Scale','shadowScale',.5,2,.02)}</details>
    <details><summary>Diagnostics</summary>${toggle('HDRI only','hdriOnly')}${toggle('Direct lights only','directOnly')}${toggle('Disable normal maps','disableNormals')}${toggle('Disable roughness maps','disableRoughness')}${toggle('Wireframe','wireframe')}${toggle('Light helpers','lightHelpers')}${toggle('Model bounds','modelBounds')}</details>
    <div class="debug-presets"><button data-preset="previous" type="button">Previous look</button><button data-preset="hdri" type="button">HDRI only</button><button data-preset="hybrid" type="button">Hybrid test</button></div>
    <div class="debug-actions"><button data-action="save" type="button">Save</button><button data-action="load" type="button">Load</button><button data-action="copy" type="button">Copy JSON</button></div>
    <p class="debug-status" aria-live="polite"></p>
    <button class="debug-reset" type="button">Reset production values</button>`;
  experience.append(panel);
  const status = panel.querySelector('.debug-status');
  const syncPanel = () => {
    panel.querySelectorAll('input').forEach((input) => {
      input[input.type === 'checkbox' ? 'checked' : 'value'] = renderSettings[input.dataset.setting];
      if (input.type !== 'checkbox') input.nextElementSibling.value = Number(renderSettings[input.dataset.setting]).toFixed(2);
    });
    panel.querySelectorAll('select').forEach((element) => { element.value = renderSettings[element.dataset.setting]; });
  };
  const showStatus = (message) => {
    status.textContent = message;
    clearTimeout(showStatus.timeoutId);
    showStatus.timeoutId = setTimeout(() => { status.textContent = ''; }, 2500);
  };
  panel.querySelectorAll('input').forEach((input) => input.addEventListener('input', () => {
    renderSettings[input.dataset.setting] = input.type === 'checkbox' ? input.checked : Number(input.value);
    if (input.type !== 'checkbox') input.nextElementSibling.value = Number(input.value).toFixed(2);
    updateDebugRendering();
  }));
  panel.querySelectorAll('select').forEach((element) => element.addEventListener('change', () => {
    renderSettings[element.dataset.setting] = element.value;
    updateDebugRendering();
  }));
  panel.querySelectorAll('[data-diagnostic]').forEach((input) => input.addEventListener('change', () => {
    const selected = input.dataset.diagnostic;
    Object.keys(textureDiagnostics).forEach((key) => {
      textureDiagnostics[key] = key === selected ? input.checked : false;
    });
    panel.querySelectorAll('[data-diagnostic]').forEach((control) => {
      control.checked = textureDiagnostics[control.dataset.diagnostic];
    });
    updateDebugRendering();
  }));
  panel.querySelector('[data-texture-preset="stress"]').addEventListener('click', () => {
    Object.assign(renderSettings, stressTextureSettings);
    textureDiagnostics.visualizeRoughness = true;
    textureDiagnostics.visualizeNormal = false;
    syncPanel();
    panel.querySelectorAll('[data-diagnostic]').forEach((control) => {
      control.checked = textureDiagnostics[control.dataset.diagnostic];
    });
    updateDebugRendering();
    showStatus('Texture stress test active.');
  });
  panel.querySelector('[data-texture-preset="subtle"]').addEventListener('click', () => {
    Object.assign(renderSettings, subtleTextureSettings);
    textureDiagnostics.visualizeRoughness = false;
    textureDiagnostics.visualizeNormal = false;
    syncPanel();
    panel.querySelectorAll('[data-diagnostic]').forEach((control) => { control.checked = false; });
    updateDebugRendering();
    showStatus('Subtle texture restored.');
  });
  panel.querySelector('[data-preset="previous"]').addEventListener('click', () => {
    Object.assign(renderSettings, previousRenderSettings);
    syncPanel();
    updateDebugRendering();
    showStatus('Previous look restored.');
  });
  panel.querySelector('[data-preset="hdri"]').addEventListener('click', () => {
    Object.assign(renderSettings, hdriTestSettings);
    syncPanel();
    updateDebugRendering();
    showStatus('HDRI test applied.');
  });
  panel.querySelector('[data-preset="hybrid"]').addEventListener('click', () => {
    Object.assign(renderSettings, hybridTestSettings);
    syncPanel();
    updateDebugRendering();
    showStatus('Hybrid lighting applied.');
  });
  panel.querySelector('[data-action="save"]').addEventListener('click', () => {
    localStorage.setItem(storageKey, JSON.stringify(renderSettings));
    showStatus('Saved in this browser.');
  });
  panel.querySelector('[data-action="load"]').addEventListener('click', () => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) { showStatus('No saved settings yet.'); return; }
    try {
      Object.assign(renderSettings, renderDefaults, JSON.parse(saved));
      syncPanel();
      updateDebugRendering();
      showStatus('Saved settings loaded.');
    } catch {
      showStatus('Saved settings are invalid.');
    }
  });
  panel.querySelector('[data-action="copy"]').addEventListener('click', async () => {
    const json = JSON.stringify(renderSettings, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      showStatus('Settings JSON copied.');
    } catch {
      window.prompt('Copy these render settings:', json);
    }
  });
  panel.querySelector('.debug-reset').addEventListener('click', () => {
    Object.assign(renderSettings, renderDefaults);
    syncPanel();
    updateDebugRendering();
    showStatus('Production values restored.');
  });
}

function createTextureDebugControls() {
  if (!new URLSearchParams(location.search).has('debug')) return;
  const textureDefaults = {
    cleanRoughnessTextureStrength: renderSettings.cleanRoughnessTextureStrength,
    cleanRoughnessTextureScale: renderSettings.cleanRoughnessTextureScale,
    cleanNormalTextureStrength: renderSettings.cleanNormalTextureStrength,
    cleanNormalTextureScale: renderSettings.cleanNormalTextureScale,
    cleanBaseVariationStrength: renderSettings.cleanBaseVariationStrength,
    cleanBaseVariationScale: renderSettings.cleanBaseVariationScale,
    vestTextureStrength: renderSettings.vestTextureStrength,
    vestTextureScale: renderSettings.vestTextureScale,
  };
  const slider = (label, setting, min, max, step) => `<label>${label}<input data-texture-setting="${setting}" type="range" min="${min}" max="${max}" step="${step}" value="${renderSettings[setting]}"><output>${Number(renderSettings[setting]).toFixed(3)}</output></label>`;
  const panel = document.createElement('aside');
  panel.className = 'render-debug texture-debug';
  panel.innerHTML = `
    <strong>Texture tuning</strong>
    <details open><summary>Exoskeleton black</summary>
      ${slider('Color noise strength','cleanBaseVariationStrength',0,.15,.002)}
      ${slider('Color noise scale','cleanBaseVariationScale',1,160,1)}
      ${slider('Normal strength','cleanNormalTextureStrength',0,.25,.002)}
      ${slider('Normal scale','cleanNormalTextureScale',1,160,1)}
      ${slider('Roughness noise','cleanRoughnessTextureStrength',0,.5,.01)}
      ${slider('Roughness scale','cleanRoughnessTextureScale',1,160,1)}
    </details>
    <details open><summary>Vest</summary>
      ${slider('Noise strength','vestTextureStrength',0,.2,.002)}
      ${slider('Noise scale','vestTextureScale',1,160,1)}
    </details>
    <div class="debug-actions"><button data-texture-action="copy" type="button">Copy JSON</button><button data-texture-action="reset" type="button">Reset</button></div>
    <p class="debug-status" aria-live="polite"></p>`;
  experience.append(panel);
  const status = panel.querySelector('.debug-status');
  const showStatus = (message) => {
    status.textContent = message;
    clearTimeout(showStatus.timeoutId);
    showStatus.timeoutId = setTimeout(() => { status.textContent = ''; }, 2200);
  };
  const sync = () => panel.querySelectorAll('[data-texture-setting]').forEach((input) => {
    input.value = renderSettings[input.dataset.textureSetting];
    input.nextElementSibling.value = Number(input.value).toFixed(3);
  });
  panel.querySelectorAll('[data-texture-setting]').forEach((input) => input.addEventListener('input', () => {
    renderSettings[input.dataset.textureSetting] = Number(input.value);
    input.nextElementSibling.value = Number(input.value).toFixed(3);
    updateDebugRendering();
  }));
  panel.querySelector('[data-texture-action="copy"]').addEventListener('click', async () => {
    const values = Object.fromEntries(Object.keys(textureDefaults).map((key) => [key, renderSettings[key]]));
    const json = JSON.stringify(values, null, 2);
    try {
      await navigator.clipboard.writeText(json);
      showStatus('Texture JSON copied.');
    } catch {
      window.prompt('Copy texture settings:', json);
    }
  });
  panel.querySelector('[data-texture-action="reset"]').addEventListener('click', () => {
    Object.assign(renderSettings, textureDefaults);
    sync();
    updateDebugRendering();
    showStatus('Texture values reset.');
  });
}

function createBlueTintDebugControl() {
  if (!new URLSearchParams(location.search).has('debug')) return;
  const panel = document.createElement('aside');
  panel.className = 'render-debug blue-tint-debug';
  panel.innerHTML = `
    <strong>Blue tint tuning</strong>
    <label>Material blue tint
      <input data-blue-tint type="range" min="0" max="1" step="0.01" value="${renderSettings.blueTintAmount}">
      <output>${renderSettings.blueTintAmount.toFixed(2)}</output>
    </label>`;
  experience.append(panel);
  const input = panel.querySelector('[data-blue-tint]');
  input.addEventListener('input', () => {
    renderSettings.blueTintAmount = Number(input.value);
    input.nextElementSibling.value = renderSettings.blueTintAmount.toFixed(2);
    updateDebugRendering();
  });
}

function createLightDebugControls() {
  if (!new URLSearchParams(location.search).has('debug')) return;
  const keys = ['A', 'B', 'C', 'D'];
  const names = { A: 'A · Upper left cross', B: 'B · Upper right cross', C: 'C · Camera-right center', D: 'D · Lower-right up' };
  const slider = (label, setting, min, max, step) => `<label>${label}<input data-light-setting="${setting}" type="range" min="${min}" max="${max}" step="${step}" value="${renderSettings[setting]}"><output>${Number(renderSettings[setting]).toFixed(2)}</output></label>`;
  const panel = document.createElement('aside');
  panel.className = 'render-debug light-debug';
  panel.innerHTML = `<strong>Cross light tuning</strong>
    ${keys.map((key) => `<details ${key === 'A' ? 'open' : ''}><summary>${names[key]}</summary>
      ${slider('Intensity',`light${key}Intensity`,0,3,.02)}
      ${slider('Cone angle',`light${key}Angle`,15,80,1)}
      ${slider('Softness',`light${key}Softness`,0,1,.01)}
      ${slider('Camera right',`light${key}Right`,-2.5,2.5,.02)}
      ${slider('Camera up',`light${key}Up`,-2.5,2.5,.02)}
      ${slider('Behind (+) / front (-)',`light${key}Depth`,-2.5,2.5,.02)}
      ${slider('Target right',`light${key}TargetRight`,-1,1,.02)}
      ${slider('Target up',`light${key}TargetUp`,-.6,.6,.01)}
    </details>`).join('')}
    <label class="debug-toggle"><input data-light-helpers type="checkbox">Show light helpers</label>
    <div class="debug-actions"><button data-light-copy type="button">Copy JSON</button><button data-light-reset type="button">Reset</button></div>
    <p class="debug-status" aria-live="polite"></p>`;
  experience.append(panel);
  const defaults = Object.fromEntries(Object.entries(renderDefaults).filter(([key]) => /^light[A-D]/.test(key)));
  const status = panel.querySelector('.debug-status');
  const sync = () => panel.querySelectorAll('[data-light-setting]').forEach((input) => {
    input.value = renderSettings[input.dataset.lightSetting];
    input.nextElementSibling.value = Number(input.value).toFixed(2);
  });
  panel.querySelectorAll('[data-light-setting]').forEach((input) => input.addEventListener('input', () => {
    renderSettings[input.dataset.lightSetting] = Number(input.value);
    input.nextElementSibling.value = Number(input.value).toFixed(2);
    updateDebugRendering();
  }));
  panel.querySelector('[data-light-helpers]').addEventListener('change', (event) => {
    renderSettings.lightHelpers = event.currentTarget.checked;
    updateDebugRendering();
  });
  panel.querySelector('[data-light-copy]').addEventListener('click', async () => {
    const values = Object.fromEntries(Object.keys(defaults).map((key) => [key, renderSettings[key]]));
    const json = JSON.stringify(values, null, 2);
    try { await navigator.clipboard.writeText(json); status.textContent = 'Light JSON copied.'; }
    catch { window.prompt('Copy light settings:', json); }
  });
  panel.querySelector('[data-light-reset]').addEventListener('click', () => {
    Object.assign(renderSettings, defaults);
    sync();
    updateDebugRendering();
    status.textContent = 'Production lighting restored.';
  });
}

createLightDebugControls();


function frameModel(object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const radius = Math.max(size.x, size.y, size.z);
  modelRadius = radius;
  modelHeight = size.y;

  object.position.sub(center);
  object.rotation.y += THREE.MathUtils.degToRad(50);
  const screenRightOffset = new THREE.Vector3(0.866, 0, -0.5).multiplyScalar(radius * 0.72);
  screenRightOffset.y = -size.y * 0.035;
  object.position.add(screenRightOffset);
  modelTarget.copy(screenRightOffset);

  keyLight.shadow.camera.near = radius * 0.1;
  keyLight.shadow.camera.far = radius * 8;
  keyLight.shadow.camera.fov = 56;
  keyLight.shadow.camera.updateProjectionMatrix();

  if (!contactGlow) {
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 256;
    glowCanvas.height = 256;
    const context = glowCanvas.getContext('2d');
    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.24)');
    gradient.addColorStop(0.22, 'rgba(0, 0, 0, 0.13)');
    gradient.addColorStop(0.55, 'rgba(0, 0, 0, 0.035)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);

    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    contactGlow = new THREE.Mesh(
      new THREE.CircleGeometry(1, 64),
      new THREE.MeshBasicMaterial({
        map: glowTexture,
        transparent: true,
        opacity: 0.5,
        blending: THREE.NormalBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    contactGlow.rotation.x = -Math.PI / 2;
    contactGlow.renderOrder = -1;
    scene.add(contactGlow);
  }

  contactGlow.scale.set(radius * 0.42, radius * 0.24, 1);
  contactGlow.position.set(screenRightOffset.x, -size.y * 0.511, screenRightOffset.z);
  homeTarget.set(0, 0, 0);
  homePosition.set(radius * 0.94, radius * 0.25, radius * 1.66);
  camera.position.copy(homePosition);
  controls.target.copy(homeTarget);
  controls.minDistance = radius * 0.55;
  controls.maxDistance = radius * 3.5;
  camera.near = Math.max(radius / 1000, 0.01);
  camera.far = radius * 100;
  camera.updateProjectionMatrix();
  controls.update();

  const cameraToProduct = screenRightOffset.clone().sub(homePosition).normalize();
  const cameraRight = new THREE.Vector3().crossVectors(cameraToProduct, camera.up).normalize();
  const cameraUp = new THREE.Vector3().crossVectors(cameraRight, cameraToProduct).normalize();
  const productToCamera = cameraToProduct.clone().negate();
  const behind = cameraToProduct;

  const centralAssembly = screenRightOffset.clone().addScaledVector(cameraUp, -size.y * 0.08);
  const lowerAssembly = screenRightOffset.clone().addScaledVector(cameraUp, -size.y * 0.28);

  // A/B sit behind opposite upper corners and cross their beams over the chassis.
  keyLight.position.copy(screenRightOffset)
    .addScaledVector(behind, radius * 1.12)
    .addScaledVector(cameraRight, -radius * 1.02)
    .addScaledVector(cameraUp, radius * 0.92);
  keyLight.target.position.copy(centralAssembly).addScaledVector(cameraRight, radius * 0.18);

  rimLight.position.copy(screenRightOffset)
    .addScaledVector(behind, radius * 1.18)
    .addScaledVector(cameraRight, radius * 1.05)
    .addScaledVector(cameraUp, radius * 0.98);
  rimLight.target.position.copy(centralAssembly).addScaledVector(cameraRight, -radius * 0.2);

  // C comes from camera-right but remains off-axis, aimed into the dark center/lower body.
  backgroundLeftLight.position.copy(screenRightOffset)
    .addScaledVector(productToCamera, radius * 1.05)
    .addScaledVector(cameraRight, radius * 1.28)
    .addScaledVector(cameraUp, radius * 0.12);
  backgroundLeftLight.target.position.copy(centralAssembly).addScaledVector(cameraUp, -size.y * 0.05);

  // D rises diagonally from low camera-right to catch rods, frame edges, and feet.
  backgroundRightLight.position.copy(screenRightOffset)
    .addScaledVector(productToCamera, radius * 0.42)
    .addScaledVector(cameraRight, radius * 1.02)
    .addScaledVector(cameraUp, -radius * 1.08);
  backgroundRightLight.target.position.copy(lowerAssembly).addScaledVector(cameraRight, -radius * 0.14);

  if (!lightHelpers.length) {
    const keyHelper = new THREE.SpotLightHelper(keyLight, 0xffffff);
    const rimHelper = new THREE.SpotLightHelper(rimLight, 0x4f9fff);
    const backdropLeftHelper = new THREE.SpotLightHelper(backgroundLeftLight, 0x267ed9);
    const backdropRightHelper = new THREE.SpotLightHelper(backgroundRightLight, 0x78baff);
    scene.add(keyHelper, rimHelper, backdropLeftHelper, backdropRightHelper);
    lightHelpers = [keyHelper, rimHelper, backdropLeftHelper, backdropRightHelper];
    lightHelpers.forEach((helper) => { helper.visible = false; });
  }
  if (!modelBoundsHelper) {
    modelBoundsHelper = new THREE.Box3Helper(new THREE.Box3().setFromObject(object), 0x4da3ff);
    modelBoundsHelper.visible = false;
    scene.add(modelBoundsHelper);
  }
  updateDebugRendering();
}

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
dracoLoader.setDecoderConfig({ type: 'wasm' });

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

if (!staticHeroRender) gltfLoader.load(
  new URL('../assets/old exo.glb', import.meta.url).href,
  (gltf) => {
    model = gltf.scene;
    model.updateMatrixWorld(true);
    const sharedGrainBounds = new THREE.Box3().setFromObject(model);
    const sharedGrainMin = sharedGrainBounds.min.clone();
    const sharedGrainSize = sharedGrainBounds.getSize(new THREE.Vector3());
    sharedGrainSize.set(
      Math.max(sharedGrainSize.x, 0.0001),
      Math.max(sharedGrainSize.y, 0.0001),
      Math.max(sharedGrainSize.z, 0.0001),
    );
    const sharedGrainScale = Math.max(sharedGrainSize.x, sharedGrainSize.y, sharedGrainSize.z);
    model.traverse((child) => {
      if (!child.isMesh) return;
      if (hiddenParts.has(normalizePartName(child.name))) {
        child.visible = false;
        return;
      }
      child.castShadow = true;
      child.receiveShadow = true;
      child.material = child.material.clone();
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material, materialIndex) => {
        modelMaterials.add(material);
        material.userData.originalNormalMap = material.normalMap;
        material.userData.originalRoughnessMap = material.roughnessMap;
        material.userData.originalNormalScale = material.normalScale?.clone() ?? new THREE.Vector2(1, 1);
        material.userData.originalRoughness = material.roughness ?? 0.5;
        material.envMapIntensity = 0.52;
        [material.map, material.normalMap, material.roughnessMap, material.metalnessMap]
          .filter(Boolean)
          .forEach((texture) => {
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
          });

        // Preserve every embedded PBR map. Only the untextured black plastic
        // receives conservative physical properties for studio reflections.
        const isPearlBlack = material.name.toLowerCase().includes('pearl black');
        if (isPearlBlack && (material.isMeshStandardMaterial || material.isMeshPhysicalMaterial)) {
          material.color.setRGB(0.025, 0.025, 0.025);
          material.metalness = 0.39;
          material.roughness = 0.76;
          material.roughnessMap = blackRoughnessNoise;
          material.userData.originalRoughnessMap = blackRoughnessNoise;
          material.normalMap = blackNoiseNormalMap;
          material.normalScale.set(0.62, 0.62);
          material.userData.originalNormalMap = blackNoiseNormalMap;
          material.userData.originalNormalScale.set(0.62, 0.62);
          material.envMapIntensity = 0.7;
          if ('clearcoat' in material) {
            material.clearcoat = 0.15;
            material.clearcoatRoughness = 0.61;
          }
          material.onBeforeCompile = (shader) => {
            shader.uniforms.blackNoiseMap = { value: blackNoiseNormalMap };
            shader.uniforms.blackNoiseAmount = { value: renderSettings.blackNoise };
            shader.fragmentShader = `uniform sampler2D blackNoiseMap;
              uniform float blackNoiseAmount;
              ${shader.fragmentShader}`;
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <map_fragment>',
              `#include <map_fragment>
              float blackSurfaceNoise = texture2D(blackNoiseMap, vRoughnessMapUv).g - 0.5;
              diffuseColor.rgb = max(vec3(0.0), diffuseColor.rgb + blackSurfaceNoise * blackNoiseAmount);`,
            );
            material.userData.tuningShader = shader;
          };
          material.customProgramCacheKey = () => 'black-noise-tuning-v1';
          blackPlasticMaterials.add(material);
          const cleanMaterial = new THREE.MeshPhysicalMaterial({
            name: `${material.name} — clean A/B test`,
            color: '#2a2e33',
            metalness: 0,
            roughness: 0.54,
            clearcoat: 0.02,
            clearcoatRoughness: 0.7,
            envMapIntensity: 0.55,
            side: material.side,
          });
          const partSeed = [...`${child.name}:${materialIndex}`]
            .reduce((value, character) => ((value * 31) + character.charCodeAt(0)) >>> 0, 2166136261);
          const partVariation = (partSeed % 1000) / 999;
          cleanMaterial.userData.partTone = THREE.MathUtils.lerp(0.88, 1.12, partVariation);
          cleanMaterial.userData.partRoughnessOffset = THREE.MathUtils.lerp(-0.045, 0.045, 1 - partVariation);
          const cleanGrainMap = visibleBlackGrain.clone();
          cleanGrainMap.repeat.setScalar(Math.max(1, renderSettings.cleanBaseVariationScale / 12));
          cleanGrainMap.needsUpdate = true;
          cleanMaterial.map = cleanGrainMap;
          cleanMaterial.userData.cleanGrainMap = cleanGrainMap;
          const cleanBumpMap = visibleBlackGrain.clone();
          cleanBumpMap.colorSpace = THREE.NoColorSpace;
          cleanBumpMap.repeat.setScalar(Math.max(1, renderSettings.cleanNormalTextureScale / 12));
          cleanBumpMap.needsUpdate = true;
          cleanMaterial.bumpMap = cleanBumpMap;
          cleanMaterial.bumpScale = renderSettings.cleanNormalTextureStrength * 0.16;
          cleanMaterial.userData.cleanBumpMap = cleanBumpMap;
          const cleanSmoothNormalMap = blackNoiseNormalMap.clone();
          cleanSmoothNormalMap.repeat.setScalar(Math.max(1, renderSettings.cleanNormalTextureScale / 12));
          cleanSmoothNormalMap.needsUpdate = true;
          cleanMaterial.bumpMap = null;
          cleanMaterial.normalMap = cleanSmoothNormalMap;
          cleanMaterial.normalScale.setScalar(renderSettings.cleanNormalTextureStrength);
          cleanMaterial.userData.cleanSmoothNormalMap = cleanSmoothNormalMap;
          const grainObjectToModel = child.matrixWorld.clone();
          cleanMaterial.onBeforeCompile = (shader) => {
            shader.uniforms.imperfectionMap = { value: blackRoughnessNoise };
            shader.uniforms.imperfectionEnabled = { value: renderSettings.cleanTextureMode === 'procedural' ? 1 : 0 };
            shader.uniforms.roughnessVariation = { value: renderSettings.cleanRoughnessTextureStrength };
            shader.uniforms.roughnessTextureScale = { value: renderSettings.cleanRoughnessTextureScale };
            shader.uniforms.baseVariation = { value: renderSettings.cleanBaseVariationStrength };
            shader.uniforms.baseTextureScale = { value: renderSettings.cleanBaseVariationScale };
            shader.uniforms.blueTintAmount = { value: renderSettings.blueTintAmount };
            shader.uniforms.diagnosticNormalMap = { value: cleanBumpMap };
            shader.uniforms.normalTextureScale = { value: renderSettings.cleanNormalTextureScale };
            shader.uniforms.grainBoundsMin = { value: sharedGrainMin };
            shader.uniforms.grainBoundsSize = { value: sharedGrainScale };
            shader.uniforms.grainObjectToModel = { value: grainObjectToModel };
            shader.uniforms.visualizeRoughness = { value: 0 };
            shader.uniforms.visualizeNormal = { value: 0 };
            shader.vertexShader = `varying vec2 vBlackImperfectionUv;
              varying vec3 vObjectGrainPosition;
              uniform vec3 grainBoundsMin;
              uniform float grainBoundsSize;
              uniform mat4 grainObjectToModel;
              ${shader.vertexShader}`;
            shader.vertexShader = shader.vertexShader.replace(
              '#include <uv_vertex>',
              `#include <uv_vertex>
              vBlackImperfectionUv = uv;
              vec3 grainModelPosition = (grainObjectToModel * vec4(position, 1.0)).xyz;
              vObjectGrainPosition = (grainModelPosition - grainBoundsMin) / grainBoundsSize;`,
            );
            shader.fragmentShader = `
              uniform sampler2D imperfectionMap;
              uniform float imperfectionEnabled;
              uniform float roughnessVariation;
              uniform float roughnessTextureScale;
              uniform float baseVariation;
              uniform float baseTextureScale;
              uniform float blueTintAmount;
              uniform sampler2D diagnosticNormalMap;
              uniform float normalTextureScale;
              uniform float visualizeRoughness;
              uniform float visualizeNormal;
              varying vec2 vBlackImperfectionUv;
              varying vec3 vObjectGrainPosition;
              float grainHash(vec3 p) {
                p = fract(p * 0.1031);
                p += dot(p, p.yzx + 33.33);
                return fract((p.x + p.y) * p.z);
              }
              float objectGrain(vec3 p) {
                vec3 cell = floor(p);
                vec3 f = fract(p);
                f = f * f * (3.0 - 2.0 * f);
                float n000 = grainHash(cell);
                float n100 = grainHash(cell + vec3(1.0, 0.0, 0.0));
                float n010 = grainHash(cell + vec3(0.0, 1.0, 0.0));
                float n110 = grainHash(cell + vec3(1.0, 1.0, 0.0));
                float n001 = grainHash(cell + vec3(0.0, 0.0, 1.0));
                float n101 = grainHash(cell + vec3(1.0, 0.0, 1.0));
                float n011 = grainHash(cell + vec3(0.0, 1.0, 1.0));
                float n111 = grainHash(cell + vec3(1.0));
                return mix(mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
                           mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y), f.z);
              }
              float blurredObjectGrain(vec3 p) {
                const float spread = 2.0;
                return (
                  objectGrain(p) * 0.22
                  + objectGrain(p + vec3(spread, 0.0, 0.0)) * 0.13
                  + objectGrain(p - vec3(spread, 0.0, 0.0)) * 0.13
                  + objectGrain(p + vec3(0.0, spread, 0.0)) * 0.13
                  + objectGrain(p - vec3(0.0, spread, 0.0)) * 0.13
                  + objectGrain(p + vec3(0.0, 0.0, spread)) * 0.13
                  + objectGrain(p - vec3(0.0, 0.0, spread)) * 0.13
                );
              }
              ${shader.fragmentShader}`;
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <map_fragment>',
              `#include <map_fragment>
              float cleanBaseNoise = blurredObjectGrain(vObjectGrainPosition * baseTextureScale) - 0.5;
              diffuseColor.rgb = max(vec3(0.0), diffuseColor.rgb + cleanBaseNoise * baseVariation * imperfectionEnabled);
              float blackTintLuma = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
              vec3 blackBlueTint = vec3(0.10, 0.32, 1.0) * max(blackTintLuma * 1.7, 0.018);
              diffuseColor.rgb = mix(diffuseColor.rgb, blackBlueTint, blueTintAmount);`,
            );
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <roughnessmap_fragment>',
              `#include <roughnessmap_fragment>
              float cleanRoughnessNoise = (texture2D(imperfectionMap, vBlackImperfectionUv * roughnessTextureScale).r - 0.95) * 10.0;
              roughnessFactor = clamp(roughnessFactor + cleanRoughnessNoise * roughnessVariation * imperfectionEnabled, 0.04, 1.0);`,
            );
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <opaque_fragment>',
              `if (visualizeRoughness > 0.5) {
                float diagnosticRoughness = clamp((texture2D(imperfectionMap, vBlackImperfectionUv * roughnessTextureScale).r - 0.9) * 10.0, 0.0, 1.0);
                outgoingLight = vec3(diagnosticRoughness);
              } else if (visualizeNormal > 0.5) {
                outgoingLight = texture2D(diagnosticNormalMap, vBlackImperfectionUv * normalTextureScale).rgb;
              }
              #include <opaque_fragment>`,
            );
            cleanMaterial.userData.tuningShader = shader;
          };
          cleanMaterial.customProgramCacheKey = () => 'clean-black-imperfection-v1';
          cleanMaterial.userData.originalNormalMap = cleanSmoothNormalMap;
          cleanMaterial.userData.originalRoughnessMap = null;
          cleanMaterial.userData.originalNormalScale = new THREE.Vector2(1, 1);
          cleanMaterial.userData.originalRoughness = 0.54;
          cleanBlackMaterials.add(cleanMaterial);
          modelMaterials.add(cleanMaterial);
          blackMaterialBindings.push({
            mesh: child,
            materialIndex,
            original: material,
            clean: cleanMaterial,
          });
          material.needsUpdate = true;
        }

        const isVest = material.map && material.normalMap && !isPearlBlack;
        if (isVest && (material.isMeshStandardMaterial || material.isMeshPhysicalMaterial)) {
          vestMaterials.add(material);
          child.geometry.computeBoundingBox();
          const vestBounds = child.geometry.boundingBox;
          const vestGrainMin = vestBounds.min.clone();
          const vestGrainSize = vestBounds.getSize(new THREE.Vector3());
          vestGrainSize.set(
            Math.max(vestGrainSize.x, 0.0001),
            Math.max(vestGrainSize.y, 0.0001),
            Math.max(vestGrainSize.z, 0.0001),
          );
          material.onBeforeCompile = (shader) => {
            shader.uniforms.vestBrightness = { value: renderSettings.vestBrightness };
            shader.uniforms.vestSaturation = { value: renderSettings.vestSaturation };
            shader.uniforms.vestTextureStrength = { value: renderSettings.vestTextureStrength };
            shader.uniforms.vestTextureScale = { value: renderSettings.vestTextureScale };
            shader.uniforms.blueTintAmount = { value: renderSettings.blueTintAmount };
            shader.uniforms.vestGrainMin = { value: vestGrainMin };
            shader.uniforms.vestGrainSize = { value: vestGrainSize };
            shader.vertexShader = `varying vec3 vVestGrainPosition;
              uniform vec3 vestGrainMin;
              uniform vec3 vestGrainSize;
              ${shader.vertexShader}`;
            shader.vertexShader = shader.vertexShader.replace(
              '#include <uv_vertex>',
              `#include <uv_vertex>
              vVestGrainPosition = (position - vestGrainMin) / vestGrainSize;`,
            );
            shader.fragmentShader = `uniform float vestBrightness;
              uniform float vestSaturation;
              uniform float vestTextureStrength;
              uniform float vestTextureScale;
              uniform float blueTintAmount;
              varying vec3 vVestGrainPosition;
              float vestGrainHash(vec3 p) {
                p = fract(p * 0.1031);
                p += dot(p, p.yzx + 33.33);
                return fract((p.x + p.y) * p.z);
              }
              float vestObjectGrain(vec3 p) {
                vec3 cell = floor(p);
                vec3 f = fract(p);
                f = f * f * (3.0 - 2.0 * f);
                float n000 = vestGrainHash(cell);
                float n100 = vestGrainHash(cell + vec3(1.0, 0.0, 0.0));
                float n010 = vestGrainHash(cell + vec3(0.0, 1.0, 0.0));
                float n110 = vestGrainHash(cell + vec3(1.0, 1.0, 0.0));
                float n001 = vestGrainHash(cell + vec3(0.0, 0.0, 1.0));
                float n101 = vestGrainHash(cell + vec3(1.0, 0.0, 1.0));
                float n011 = vestGrainHash(cell + vec3(0.0, 1.0, 1.0));
                float n111 = vestGrainHash(cell + vec3(1.0));
                return mix(mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
                           mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y), f.z);
              }
              float blurredVestGrain(vec3 p) {
                const float spread = 2.0;
                return (
                  vestObjectGrain(p) * 0.22
                  + vestObjectGrain(p + vec3(spread, 0.0, 0.0)) * 0.13
                  + vestObjectGrain(p - vec3(spread, 0.0, 0.0)) * 0.13
                  + vestObjectGrain(p + vec3(0.0, spread, 0.0)) * 0.13
                  + vestObjectGrain(p - vec3(0.0, spread, 0.0)) * 0.13
                  + vestObjectGrain(p + vec3(0.0, 0.0, spread)) * 0.13
                  + vestObjectGrain(p - vec3(0.0, 0.0, spread)) * 0.13
                );
              }
              ${shader.fragmentShader}`;
            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <map_fragment>',
              `#include <map_fragment>
              float vestLuma = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
              diffuseColor.rgb = mix(vec3(vestLuma), diffuseColor.rgb, vestSaturation) * vestBrightness;
              float vestSurfaceNoise = (
                blurredVestGrain(vVestGrainPosition * vestTextureScale) * 0.82
                + blurredVestGrain(vVestGrainPosition * vestTextureScale * 1.7 + vec3(8.7)) * 0.18
              ) - 0.5;
              diffuseColor.rgb = max(vec3(0.0), diffuseColor.rgb + vestSurfaceNoise * vestTextureStrength);
              float vestTintLuma = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
              vec3 vestBlueTint = vec3(0.12, 0.38, 1.0) * vestTintLuma * 1.25;
              diffuseColor.rgb = mix(diffuseColor.rgb, vestBlueTint, blueTintAmount);`,
            );
            material.userData.tuningShader = shader;
          };
          material.customProgramCacheKey = () => 'vest-live-tuning-v1';
          material.needsUpdate = true;
        }
      });
    });
    scene.add(model);
    frameModel(model);

    if (gltf.animations.length) {
      mixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
      animationButton.hidden = false;
      viewerControls.hidden = false;
      animationButton.classList.add('active');
    }

    loadBar.style.width = '100%';
    loadPercent.textContent = '100%';
    setTimeout(() => loaderElement.classList.add('is-hidden'), 350);
    dracoLoader.dispose();
  },
  (event) => {
    if (!event.total) return;
    const percentage = Math.round((event.loaded / event.total) * 100);
    loadBar.style.width = `${percentage}%`;
    loadPercent.textContent = `${percentage}%`;
  },
  showLoadError,
);

function showLoadError(error) {
  console.error(error);
  loaderElement.querySelector('.loader-copy span').textContent = 'Unable to load model';
  loadPercent.textContent = '!';
}

animationButton.addEventListener('click', () => {
  const playing = !animationButton.classList.contains('active');
  animationButton.classList.toggle('active', playing);
  mixer.timeScale = playing ? 1 : 0;
});

const clock = new THREE.Clock();
function animate() {
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  controls.update();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

new IntersectionObserver(([entry]) => {
  renderer.setAnimationLoop(entry.isIntersecting ? animate : null);
}, { threshold: 0.01 }).observe(experience);

const revealSections = document.querySelectorAll('.reveal');
revealSections.forEach((section) => section.classList.add('is-visible'));

const exocoreStickyHeading = document.querySelector('.exocore-details-heading');
const exocoreDetailsSection = document.querySelector('.exocore-details');
const exocoreImageSpace = document.querySelector('.exocore-image-space');
const exocoreFactCards = [...document.querySelectorAll('.exocore-detail-fact')];
let exocoreSyncFrame = 0;
function syncExocoreHeadingHeight() {
  if (!exocoreStickyHeading || !exocoreDetailsSection) return;
  exocoreDetailsSection.style.setProperty('--exo-heading-height', `${exocoreStickyHeading.offsetHeight}px`);
}
function syncExocoreStickyRelease() {
  exocoreSyncFrame = 0;
  updateExocoreFactHighlight();
  if (!exocoreStickyHeading || !exocoreImageSpace || innerWidth <= 760) {
    if (exocoreStickyHeading) exocoreStickyHeading.style.transform = '';
    return;
  }

  exocoreStickyHeading.style.transform = '';
  const headingBounds = exocoreStickyHeading.getBoundingClientRect();
  const imageBounds = exocoreImageSpace.getBoundingClientRect();
  const headingStickyTop = Number.parseFloat(getComputedStyle(exocoreStickyHeading).top) || 0;
  const imageStickyTop = Number.parseFloat(getComputedStyle(exocoreImageSpace).top) || 0;
  if (headingBounds.top > headingStickyTop + 1) return;
  const imageReleaseDelta = Math.min(0, imageBounds.top - imageStickyTop);
  const desiredHeadingTop = headingStickyTop + imageReleaseDelta;
  const headingTranslation = desiredHeadingTop - headingBounds.top;
  exocoreStickyHeading.style.transform = `translateY(${headingTranslation}px)`;
}
function updateExocoreFactHighlight() {
  if (!exocoreFactCards.length) return;
  if (innerWidth <= 760) {
    exocoreFactCards.forEach((card) => card.classList.add('is-active'));
    return;
  }
  const focusY = innerHeight * .58;
  let closestCenter = 0;
  let closestDistance = Infinity;
  exocoreFactCards.forEach((card) => {
    const bounds = card.getBoundingClientRect();
    const center = bounds.top + bounds.height / 2;
    const distance = Math.abs(center - focusY);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestCenter = center;
    }
  });
  exocoreFactCards.forEach((card) => {
    const bounds = card.getBoundingClientRect();
    const center = bounds.top + bounds.height / 2;
    card.classList.toggle('is-active', Math.abs(center - closestCenter) < 32);
  });
}
function requestExocoreSync() {
  if (!exocoreSyncFrame) exocoreSyncFrame = requestAnimationFrame(syncExocoreStickyRelease);
}
syncExocoreHeadingHeight();
if (exocoreStickyHeading && 'ResizeObserver' in window) {
  new ResizeObserver(() => {
    syncExocoreHeadingHeight();
    requestExocoreSync();
  }).observe(exocoreStickyHeading);
}
window.addEventListener('scroll', requestExocoreSync, { passive: true });
requestExocoreSync();

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  syncExocoreHeadingHeight();
  requestExocoreSync();
});
