import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { createUserWorkflow } from "@medusajs/core-flows";

export default async function ensureAdminUser({ container }: ExecArgs) {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const userModuleService = container.resolve(Modules.USER);

    console.log("Checking for admin user...");

    const { data: users } = await query.graph({
        entity: "user",
        fields: ["email", "id"],
        filters: { email: "admin@medusa-test.com" }
    });

    if (users.length > 0) {
        console.log("Admin user exists:", users[0].email);
    } else {
        console.log("Admin user missing. Creating...");
        await createUserWorkflow(container).run({
            input: {
                user: {
                    email: "admin@medusa-test.com",
                    first_name: "Admin",
                    last_name: "User",
                },
                auth_identity_id: "dummy_auth_id_placeholder" // Configuring auth is complex in script, usually handled by auth module.
                // Simplified: We might need to manually inject into auth_identity as well if using v2 auth.
            }
        });
        // Note: Admin creation in V2 involves Auth Identity + User. 
        // It's safer to use the CLI command if available or rely on the initial seed.
        // Let's just create a user logic here to see if we can trigger the workflow.
        console.log("Attempted creation. Note: Might need password setting via Auth Module.");
    }
}
