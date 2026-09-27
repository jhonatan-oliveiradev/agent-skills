# 000h components

These are the upstream 000h by Cojeev registry components and their transitive source dependencies, copied from [`luv-jeri/cojeev-ui`](https://github.com/luv-jeri/cojeev-ui) at commit `374dc1c63157749052483b166d6fb0178bbd4249`. The project is MIT licensed; see [LICENSE](LICENSE). The Motion Drawer also retains its upstream UI Layout attribution inline.

Only the components used by Agent Skills Studio and their required styles were included: ShapeArtwork, HeroButton, LivingLink, and MotionDrawer. We map the `--v-*` paint tokens to our palette in `src/app/cojeev-integration.css`; do not import Cojeev's global theme or fonts. The registry source uses `@/registry/cojeev` import paths intentionally, so its dependencies remain identifiable and can be updated together.

The 000h registry installer pulls a shared bundle of 71 files. Our current project has no shadcn configuration, and the shadcn preset endpoint was unavailable during installation, so this subset was taken directly from the public upstream registry source. MotionDrawer's three `Icon` references use the existing `lucide-react` package so that its 377 KB icon inventory is not shipped for a close icon and a menu icon. Changes to the copied source should be limited to compatibility fixes and documented here.
