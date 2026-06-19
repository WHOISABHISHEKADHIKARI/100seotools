import { ImageResponse } from 'next/og';

export const size = {
  width: 192,
  height: 192,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2563eb, #22c55e)',
          borderRadius: 24,
        }}
      >
        <span
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: 'white',
            fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
          }}
        >
          SEO
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
