import { useEffect } from 'react';
import { useRouter } from 'next/router';

// 重定向到 /tours/detail/[id]
export default function TourRedirect() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      // 重定向到 /tours/detail/[id]
      router.replace(`/tours/detail/${id}`);
    }
  }, [id, router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px'
    }}>
      正在跳转到新的页面...
    </div>
  );
}