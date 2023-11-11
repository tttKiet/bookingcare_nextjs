export function useDisPlay() {
  function scrollTo(
    element: HTMLElement | null | undefined,
    {
      top,
    }: {
      top: number;
    } = { top: 100 }
  ) {
    if (!element) {
      return; // Tránh cuộn khi phần tử không tồn tại
    }
    const offsetTop = element.offsetTop - top;
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }

  return {
    scrollTo,
  };
}
