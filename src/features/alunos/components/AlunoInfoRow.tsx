interface AlunoInfoRowProps {
  label: string;
  value: string;
}

export function AlunoInfoRow({ label, value }: AlunoInfoRowProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-28 shrink-0 text-xs text-muted-foreground">{label}</span>
      <span className="text-xs text-foreground">{value}</span>
    </div>
  );
}
