import { useCustomCursor } from '../hooks/useCustomCursor';
import './Cursor.css';

export default function Cursor() {
  const { dotRef, ringRef, enabled } = useCustomCursor();
  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="custom-cursor" aria-hidden />
      <div ref={dotRef} className="custom-cursor-dot" aria-hidden />
    </>
  );
}
