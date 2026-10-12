<script lang="ts">
	import { motion } from "motion-sv";

	/**
	 * Test page for issue #1674: Interactive elements inside draggable elements
	 * should not trigger drag when clicked/interacted with.
	 */
</script>

<div style="padding: 100px">
	<motion.div
		id="draggable"
		data-testid="draggable"
		drag
		dragElastic={0}
		dragMomentum={false}
		style={{
			width: 400,
			height: 200,
			background: "red",
			display: "flex",
			flexWrap: "wrap",
			alignItems: "center",
			justifyContent: "center",
			gap: 10,
			padding: 10,
		}}
	>
		<input type="text" data-testid="input" value="Select me" style="width: 80px; height: 30px; padding: 5px" />
		<textarea data-testid="textarea" value="Text" style="width: 60px; height: 30px; padding: 5px"></textarea>
		<button data-testid="button" style="width: 60px; height: 30px; padding: 5px">Click</button>
		<a
			href="#test"
			data-testid="link"
			style="display: inline-block; width: 60px; height: 30px; padding: 5px; background: white"
		>
			Link
		</a>
		<select data-testid="select" style="width: 80px; height: 30px">
			<option value="1">Option 1</option>
			<option value="2">Option 2</option>
			<option value="3">Option 3</option>
		</select>
		<label data-testid="label" style="display: flex; align-items: center; gap: 5px; background: white; padding: 5px">
			<input type="checkbox" data-testid="checkbox" />
			Check
		</label>
		<div
			contenteditable="true"
			data-testid="contenteditable"
			style="width: 80px; height: 30px; padding: 5px; background: white"
		>
			Edit me
		</div>
	</motion.div>
</div>
