<script lang="ts">
    export let jwt: string;
    export let balance: number;
    export let email: string;
</script>

<header class="navbar bg-base-100 bg-base-200">
    <div class="flex-1">
        <!-- svelte-ignore a11y-missing-attribute -->
        <a class="btn btn-ghost normal-case text-xl">zkAuth</a>
    </div>
    <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
            <li>
                <dev>
                  Balance: {balance}
                </dev>
            </li>
          <li>
            {#if !jwt}
                <div>Sign In</div>
            {:else}
                <div>{email}</div>
            {/if}
          </li>
        </ul>
      </div>
</header>