const GradientBG = () => {
  return (
    <div
      className="absolute inset-0 z-10 h-full w-full items-center px-5 py-24"
      // className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, #010b1d 40%, #03404d 100%)",
      }}
    ></div>
  );
};
// <div class="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
const GridBG = () => {
  return (
    <div
      className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, #010b1d 40%, #03404d 100%)",
      }}
    ></div>
  );
};

export { GradientBG, GridBG };

// <div class="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>
