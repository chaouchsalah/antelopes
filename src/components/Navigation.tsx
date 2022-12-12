import { Link } from "wouter";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Container,
  Button,
} from "@mui/material";

const pages = [
  { label: "Home", path: "/" },
  { label: "Details", path: "/details" },
];

export default () => {
  return (
    <AppBar position="static" style={{ background: "var(--secondary)" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Antelopes
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map(({ label, path }) => (
              <Link href={path} className="active">
                <Button
                  key={label}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {label}
                </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
