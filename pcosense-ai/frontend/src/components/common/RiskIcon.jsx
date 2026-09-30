// src/components/common/RiskIcon.jsx
// Renders a distinct glyph per risk band (low/moderate/detected/high) so
// severity never depends on color alone — each band also has its own shape.
import { CheckCircle, InfoRounded, Warning, Cancel } from '@mui/icons-material';

const ICONS = {
  check: CheckCircle,
  info: InfoRounded,
  warning: Warning,
  cancel: Cancel,
};

const RiskIcon = ({ icon, sx, ...props }) => {
  const Component = ICONS[icon] || ICONS.check;
  return <Component sx={sx} {...props} />;
};

export default RiskIcon;
