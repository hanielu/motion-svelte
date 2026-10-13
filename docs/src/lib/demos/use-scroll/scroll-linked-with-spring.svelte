<script lang="ts">
	import { motion, useScroll, useSpring } from "motion-sv";

	// The article scrolls inside this box, which stands in for the page
	let scroller = $state<HTMLElement>();

	const { scrollYProgress } = useScroll({
		get container() {
			return scroller;
		},
	});
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});
</script>

<div class="example">
	<motion.div class="scroll-indicator" style={{ scaleX, originX: 0 }} />
	<div class="scroller" bind:this={scroller}>
		<article>
			{@render text()}
			{@render text()}
		</article>
	</div>
</div>

{#snippet text()}
	<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ac rhoncus quam.</p>
	<p>
		Fringilla quam urna. Cras turpis elit, euismod eget ligula quis, imperdiet sagittis justo. In viverra fermentum
		ex ac vestibulum. Aliquam eleifend nunc a luctus porta. Mauris laoreet augue ut felis blandit, at iaculis odio
		ultrices. Nulla facilisi. Vestibulum cursus ipsum tellus, eu tincidunt neque tincidunt a.
	</p>
	<h2>Sub-header</h2>
	<p>In eget sodales arcu, consectetur efficitur metus. Duis efficitur tincidunt odio, sit amet laoreet massa fringilla eu.</p>
	<p>
		Pellentesque id lacus pulvinar elit pulvinar pretium ac non urna. Mauris id mauris vel arcu commodo venenatis.
		Aliquam eu risus arcu. Proin sit amet lacus mollis, semper massa ut, rutrum mi.
	</p>
	<p>Sed sem nisi, luctus consequat ligula in, congue sodales nisl.</p>
	<p>
		Vestibulum bibendum at erat sit amet pulvinar. Pellentesque pharetra leo vitae tristique rutrum. Donec ut
		volutpat ante, ut suscipit leo.
	</p>
	<h2>Sub-header</h2>
	<p>
		Maecenas quis elementum nulla, in lacinia nisl. Ut rutrum fringilla aliquet. Pellentesque auctor vehicula
		malesuada. Aliquam id feugiat sem, sit amet tempor nulla. Quisque fermentum felis faucibus, vehicula metus ac,
		interdum nibh. Curabitur vitae convallis ligula. Integer ac enim vel felis pharetra laoreet. Interdum et
		malesuada fames ac ante ipsum primis in faucibus. Pellentesque hendrerit ac augue quis pretium.
	</p>
	<p>
		Morbi ut scelerisque nibh. Integer auctor, massa non dictum tristique, elit metus efficitur elit, ac pretium
		sapien nisl nec ante. In et ex ultricies, mollis mi in, euismod dolor.
	</p>
	<p>Quisque convallis ligula non magna efficitur tincidunt.</p>
	<p>
		Pellentesque id lacus pulvinar elit pulvinar pretium ac non urna. Mauris id mauris vel arcu commodo venenatis.
		Aliquam eu risus arcu. Proin sit amet lacus mollis, semper massa ut, rutrum mi.
	</p>
	<p>Sed sem nisi, luctus consequat ligula in, congue sodales nisl.</p>
	<p>
		Vestibulum bibendum at erat sit amet pulvinar. Pellentesque pharetra leo vitae tristique rutrum. Donec ut
		volutpat ante, ut suscipit leo.
	</p>
	<h2>Sub-header</h2>
	<p>
		Maecenas quis elementum nulla, in lacinia nisl. Ut rutrum fringilla aliquet. Pellentesque auctor vehicula
		malesuada. Aliquam id feugiat sem, sit amet tempor nulla. Quisque fermentum felis faucibus, vehicula metus ac,
		interdum nibh. Curabitur vitae convallis ligula. Integer ac enim vel felis pharetra laoreet. Interdum et
		malesuada fames ac ante ipsum primis in faucibus. Pellentesque hendrerit ac augue quis pretium.
	</p>
	<p>
		Morbi ut scelerisque nibh. Integer auctor, massa non dictum tristique, elit metus efficitur elit, ac pretium
		sapien nisl nec ante. In et ex ultricies, mollis mi in, euismod dolor.
	</p>
	<p>Quisque convallis ligula non magna efficitur tincidunt.</p>
{/snippet}

<style>
	.example {
		position: relative;
		box-sizing: border-box;
		width: 100%;
		height: 400px;
		overflow: hidden;
		border: 1px solid rgb(127 127 127 / 0.25);
		border-radius: 12px;
	}

	.example :global(.scroll-indicator) {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1;
		height: 10px;
		background-color: #ff0088;
	}

	.scroller {
		height: 100%;
		overflow-y: auto;
	}

	article {
		max-width: 500px;
		margin: 0 auto;
		padding: 150px 20px;
	}

	p {
		margin: 0;
		color: rgb(127 127 127);
		line-height: 1.3;
	}

	h2 {
		margin: 0;
		font-size: 30px;
		line-height: 1;
		letter-spacing: -0.04em;
	}
</style>
