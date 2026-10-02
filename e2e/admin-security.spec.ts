import { expect, test } from "@playwright/test";

const protectedRoutes = ["/admin", "/admin/products", "/admin/categories", "/admin/settings"];

for (const route of protectedRoutes) {
  test(`anonymous visitors cannot open ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page).toHaveURL(/\/admin\/login$/);
  });
}

test("malformed administrator session cookie is rejected", async ({ context, page }) => {
  await context.addCookies([{
    name: "mh_admin_session",
    value: "not.a.valid.jwt",
    url: "http://127.0.0.1:3100",
  }]);

  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
});
