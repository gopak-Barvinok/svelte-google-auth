<script lang="ts">
    import { onMount } from 'svelte'
    import {ethers} from 'ethers'

    const clientId = import.meta.env.VITE_CLIENT_ID;
    const RPC_SEPOLIA_URL= import.meta.env.VITE_RPC_SEPOLIA_URL;
    let jwt: string;
    let amount: string;
    let recipient: string;
    let errorCheckAmount: boolean;
    let errorCheckRecipient: boolean;
    let errorCheck: boolean;
    let sendClicked = false;
    let loading = false;

    let email: string;
    let balance: number;

    let networks = [
        'Ethereum',
        'Optimism'
    ]

    const provider = new ethers.JsonRpcProvider(RPC_SEPOLIA_URL);

    const googleAuthAddress = "0xfC3aad02Faa9De0B78D0Ee3D17D2346C95C8E121";

    const googleAuthAbi = [
        "function getBalance(bytes32 login) public view returns(uint160)"
    ];

    const googleAuthContract = new ethers.Contract(googleAuthAddress, googleAuthAbi, provider)

    function changeNetwork(index: number) {
        const temp = networks[0];
        networks[0] = networks[index];
        networks[index] = temp
    }

    async function sendTx() {
        sendClicked = true;
        try {
            if(!amount) {
                errorCheckAmount = true;
                if(recipient) {
                    errorCheckRecipient = false;
                }
                throw new Error('Amount or recipient is absent');
            }
            errorCheckAmount = false;
    
            if(!recipient) {
                errorCheckRecipient = true;
                throw new Error('Recipient or amount is absent');
            }
            errorCheckRecipient = false;

            errorCheck = false;
        } catch(e) {
            errorCheck = true;
        }
    }   

    onMount(async () => {
            // @ts-ignore
            const handleCredentialResponse = async (response) => {
                jwt = response.credential
                console.log('Encoded JWT ID token: ' + response.credential);

            }

            // @ts-ignore
            google.accounts.id.initialize({
                client_id: clientId,
                callback: handleCredentialResponse,
            });
    
            // @ts-ignore
            google.accounts.id.renderButton(
                document.getElementById('signInDiv'),
                { theme: 'outline', size: 'large' } // customization attributes
            );
    
            // @ts-ignore
            google.accounts.id.prompt();
        });
</script>


<svelte:head>
    <script src="https://accounts.google.com/gsi/client"></script>
</svelte:head>

<header class="navbar bg-base-100 bg-base-200">
    <div class="flex-1">
        <a class="btn btn-ghost normal-case text-xl">zkAuth</a>
    </div>
    <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
            <li>
              <details>
                <summary>
                  {networks[0]}
                </summary>
                <ul class="p-2 bg-base-100">
                    {#each networks as network}
                  <li><button on:click={() => changeNetwork(1)}>{network}</button></li>
                  <!-- <li><a>Link 2</a></li> -->
                    {/each}
                </ul>
              </details>
            </li>
            <li>
              <details>
                <summary>
                  Balance
                </summary>
                <ul class="p-2 bg-base-100">
                  <li><button>Parameters</button></li>
                </ul>
              </details>
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
<div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div class="card-body max-w-md gap-2">
        <h1 class="text-5xl font-bold">Google Autentification</h1>
        <div class="card bg-base-100 shadow-xl mt-16">
            <div class="max-w-md">
                <div class="indicator">
                    {#if errorCheckAmount}
                        <span class="indicator-item badge badge-secondary">Empty</span> 
                    {/if}
                    <input type="text" placeholder="Amount" class="input input-bordered w-full max-w-xs mt-5 mb-2"
                    bind:value={amount}/>
                </div>
                <div class="indicator">
                    {#if errorCheckRecipient}
                        <span class="indicator-item badge badge-secondary">Empty</span> 
                    {/if}
                    <input type="text" placeholder="Recipient" class="input input-bordered w-full max-w-xs mb-2"
                    bind:value={recipient}/>
                </div>
                {#if !jwt}
                    <button class="mb-5" id="signInDiv"/>
                {:else}
                    <div>
                        {#if !sendClicked}
                            <button class="btn btn-neutral mb-5" on:click={sendTx}>Send</button>
                        {:else}
                            {#if loading}
                                <button class="btn btn-neutral mb-5">
                                    <span class="loading loading-spinner"></span>
                                    loading
                                </button>
                            {:else if errorCheck || errorCheckAmount || errorCheckRecipient}
                                <button class="btn btn-error mb-5" on:click={sendTx}>Error</button>
                            {:else if !errorCheck}
                                <button class="btn btn-success mb-5">Success</button>
                            {/if}
                        {/if}
                    </div>
                {/if}
            </div>
        </div>
    </div>
    </div>
</div>