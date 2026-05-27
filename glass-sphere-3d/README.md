# 🔮 Glass Sphere 3D — Interactive Typography

An interactive 3D landing page featuring glass spheres with real-time refraction and reactive typography, built with **React Three Fiber**.

![Glass Sphere Demo](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)

## ✨ Features

- 🫧 **Glass Refraction** — Realistic glass spheres using `MeshTransmissionMaterial` with real-time light transmission and distortion
- 🖱️ **Cursor Tracking** — Main sphere follows the mouse instantly, satellite spheres trail behind with different delay speeds
- 🔤 **Reactive Typography** — Individual characters react to sphere proximity with push, scale, and rotation effects
- 🎬 **Intro Animation** — Smooth bottom-to-top fade-in entrance with staggered timing per line
- 💫 **Internal Shimmer** — Subtle refraction jitter inside spheres creating a lively glass effect
- 📱 **Responsive** — Optimized DPR settings for both desktop and mobile

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/glass-sphere-3d.git
cd glass-sphere-3d

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page (renders GlassSphereScene)
│   └── globals.css         # Global styles
└── components/
    └── ui/
        ├── GlassSphereScene.tsx  # 3D Canvas, lighting, typography, interactions
        └── LiquidSphere.tsx      # Glass sphere meshes, mouse tracking, shimmer
```

## 🎨 Customization

### Change Text Content

Edit the `<ReactiveLine>` components in `GlassSphereScene.tsx`:

```tsx
<ReactiveLine text="YOUR TEXT" y={1.8} fontSize={0.85} color="#e6e6e6" baseOutlineColor="#e6e6e6" />
```

### Adjust Sphere Properties

Edit `materialProps` in `LiquidSphere.tsx`:

```tsx
const materialProps = {
  transmission: 1,     // 1 = fully transparent glass
  roughness: 0,        // 0 = perfectly smooth  
  thickness: 3,        // Glass thickness (affects refraction)
  ior: 1.5,           // Index of refraction (1.5 = glass)
  chromaticAberration: 0.05,  // Rainbow edge effect
};
```

### Change Background Color

Update both values in `GlassSphereScene.tsx`:
```tsx
// The div background
<div className="... bg-[#121212] ...">

// The WebGL canvas background (must match!)
<color attach="background" args={["#121212"]} />
```

> ⚠️ Both values must be identical, otherwise the glass refraction will break.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js](https://nextjs.org/) | React framework |
| [Three.js](https://threejs.org/) | 3D rendering engine |
| [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) | React renderer for Three.js |
| [@react-three/drei](https://github.com/pmndrs/drei) | Useful helpers (MeshTransmissionMaterial, Text, Environment) |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS |

## 📄 License

MIT License — feel free to use, modify, and share.

## 🙏 Credits

Built with ❤️ using the amazing [pmndrs](https://github.com/pmndrs) ecosystem.
