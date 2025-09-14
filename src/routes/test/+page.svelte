<script>
	export let data;
	export let error;
</script>

<h1>Supabase Test</h1>

{#if error}
	<p style="color: red;">Error: {error.message}</p>
{/if}

<h2>Data:</h2>
<pre>{JSON.stringify(data, null, 2)}</pre>
