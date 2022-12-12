import { Alert, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { Replay } from "@mui/icons-material";
import styled from "@emotion/styled";

interface AlertProps {
  className?: string;
  loading?: boolean;
  error?: boolean;
  onTryAgain?: Function;
}

export default styled(({ className, loading, error, onTryAgain }: AlertProps) => {
  if (loading) {
    return (
      <div className={className}>
        <CircularProgress size="1.4rem" />
      </div>
    );
  }
  if (error) {
    return (
      <div className={`${className} error`}>
        <Alert severity="error">
          An error has occured, wait a little a retry if that still doesn&apos;t
          solve the problem, please contact us at: salah.chaouch@madkudu.com
          {onTryAgain && (
            <Tooltip title="Réessayer">
              <IconButton className="retry" size="small" onClick={() => onTryAgain()}>
                <Replay />
              </IconButton>
            </Tooltip>
          )}
        </Alert>
      </div>
    );
  }
  return null;
})`
  &.padding {
    padding: var(--gap);
  }

  &.error {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;

    &.small {
      .MuiChip-label {
        display: none;
      }

      .MuiChip-icon {
        margin-right: 2px;
      }
    }
  }

  .retry {
    margin-left: calc(var(--gap) * 0.16666);
  }
`;
