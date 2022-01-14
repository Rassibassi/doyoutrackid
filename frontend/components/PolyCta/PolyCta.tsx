import { forwardRef, LegacyRef } from "react";

// Copied from / inspired by
// https://dev.to/frehner/polymorphic-button-component-in-typescript-c28

export enum EPolyAs {
  button = "button",
  anchor = "anchor",
}

type TBaseProps = {
  children: React.ReactNode;
  className?: string;
};

type TCtaAsButton = TBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof TBaseProps> & {
    as?: EPolyAs.button;
  };

type TCtaAsAnchor = TBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof TBaseProps> & {
    as: EPolyAs.anchor;
  };

export type TPolyCtaProps = TCtaAsButton | TCtaAsAnchor;

const PolyCta = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  TPolyCtaProps
>((props, ref) => {
  const rootStyles = [];
  if (props.className) rootStyles.push(props.className);

  if (props.as === EPolyAs.anchor) {
    //   eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
    const { className, as, ...rest } = props;
    return (
      <a
        ref={ref as LegacyRef<HTMLAnchorElement> | undefined}
        className={rootStyles.join(" ")}
        {...rest}
      >
        {props.children}
      </a>
    );
  } else {
    //   eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
    const { className, as, ...rest } = props;
    return (
      <button
        ref={ref as LegacyRef<HTMLButtonElement> | undefined}
        className={rootStyles.join(" ")}
        {...rest}
      />
    );
  }
});

PolyCta.displayName = "PolyCta";

export default PolyCta;
