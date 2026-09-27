export default function PlusIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
      <path d="M5 12h14" />
      {!open && <path d="M12 5v14" />}
    </svg>
  );
}
