type Props = {
  status: 'Pending ICCID' | 'Awaiting Provisioning' | 'Provisioned';
};

export default function StatusBadge({ status }: Props) {
  const map = {
    'Pending ICCID': {
      dot: '#F59E0B',
      text: '#F59E0B',
    },
    'Awaiting Provisioning': {
      dot: '#F59E0B',
      text: '#F59E0B',
    },
    Provisioned: {
      dot: '#16A34A',
      text: '#16A34A',
    },
  } as const;

  const c = map[status];

  return (
    <span
      className="inline-flex items-center gap-2"
      style={{ color: c.text }}
      aria-label={`status-${status}`}
    >
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: c.dot }}
      />
      {status}
    </span>
  );
}
