import "../../style/table.css"

interface TableRootProps {
  children: React.ReactNode;
}

export function TableRoot({ children }: TableRootProps) {
  return (
    <div className="table-container">
      <table>{children}</table>
    </div>
  );
}
