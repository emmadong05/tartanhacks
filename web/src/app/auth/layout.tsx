export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, #010b1d 40%, #03404d 100%)",
      }}
    >
      {children}
    </div>
  );
}

// #010b1d and  #03404d
