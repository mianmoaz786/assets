import{Mesh as T,OrthographicCamera as k,BufferGeometry as W,Float32BufferAttribute as G,ShaderMaterial as m,UniformsUtils as F,Vector2 as u,WebGLRenderTarget as A,HalfFloatType as E,NoBlending as j,Timer as K,Color as M,Vector3 as b,AdditiveBlending as X,MeshBasicMaterial as y,RawShaderMaterial as Y,ColorManagement as q,SRGBTransfer as J,LinearToneMapping as Z,ReinhardToneMapping as $,CineonToneMapping as ee,ACESFilmicToneMapping as H,AgXToneMapping as te,NeutralToneMapping as ie,CustomToneMapping as se,WebGLRenderer as ae,SRGBColorSpace as re,PCFShadowMap as oe,BasicShadowMap as le,Scene as Q,FogExp2 as ne,PerspectiveCamera as he,DirectionalLight as C,HemisphereLight as ue,PlaneGeometry as I,ShadowMaterial as fe,PMREMGenerator as de,SphereGeometry as ce,BackSide as pe,CanvasTexture as me,EquirectangularReflectionMapping as ge}from"./three-DL1GCKva.js";const B={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class v{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const ve=new k(-1,1,1,-1,0,1);class xe extends W{constructor(){super(),this.setAttribute("position",new G([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new G([0,2,0,0,2,0],2))}}const _e=new xe;class L{constructor(e){this._mesh=new T(_e,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,ve)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class be extends v{constructor(e,i="tDiffuse"){super(),this.textureID=i,this.uniforms=null,this.material=null,e instanceof m?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=F.clone(e.uniforms),this.material=new m({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new L(this.material)}render(e,i,s){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=s.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class V extends v{constructor(e,i){super(),this.scene=e,this.camera=i,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,i,s){const a=e.getContext(),t=e.state;t.buffers.color.setMask(!1),t.buffers.depth.setMask(!1),t.buffers.color.setLocked(!0),t.buffers.depth.setLocked(!0);let r,l;this.inverse?(r=0,l=1):(r=1,l=0),t.buffers.stencil.setTest(!0),t.buffers.stencil.setOp(a.REPLACE,a.REPLACE,a.REPLACE),t.buffers.stencil.setFunc(a.ALWAYS,r,4294967295),t.buffers.stencil.setClear(l),t.buffers.stencil.setLocked(!0),e.setRenderTarget(s),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),t.buffers.color.setLocked(!1),t.buffers.depth.setLocked(!1),t.buffers.color.setMask(!0),t.buffers.depth.setMask(!0),t.buffers.stencil.setLocked(!1),t.buffers.stencil.setFunc(a.EQUAL,1,4294967295),t.buffers.stencil.setOp(a.KEEP,a.KEEP,a.KEEP),t.buffers.stencil.setLocked(!0)}}class Ce extends v{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Te{constructor(e,i){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),i===void 0){const s=e.getSize(new u);this._width=s.width,this._height=s.height,i=new A(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:E}),i.texture.name="EffectComposer.rt1"}else this._width=i.width,this._height=i.height;this.renderTarget1=i,this.renderTarget2=i.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new be(B),this.copyPass.material.blending=j,this.timer=new K}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,i){this.passes.splice(i,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const i=this.passes.indexOf(e);i!==-1&&this.passes.splice(i,1)}isLastEnabledPass(e){for(let i=e+1;i<this.passes.length;i++)if(this.passes[i].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const i=this.renderer.getRenderTarget();let s=!1;for(let a=0,t=this.passes.length;a<t;a++){const r=this.passes[a];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(a),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,s),r.needsSwap){if(s){const l=this.renderer.getContext(),o=this.renderer.state.buffers.stencil;o.setFunc(l.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),o.setFunc(l.EQUAL,1,4294967295)}this.swapBuffers()}V!==void 0&&(r instanceof V?s=!0:r instanceof Ce&&(s=!1))}}this.renderer.setRenderTarget(i)}reset(e){if(e===void 0){const i=this.renderer.getSize(new u);this._pixelRatio=this.renderer.getPixelRatio(),this._width=i.width,this._height=i.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,i){this._width=e,this._height=i;const s=this._width*this._pixelRatio,a=this._height*this._pixelRatio;this.renderTarget1.setSize(s,a),this.renderTarget2.setSize(s,a);for(let t=0;t<this.passes.length;t++)this.passes[t].setSize(s,a)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Me extends v{constructor(e,i,s=null,a=null,t=null){super(),this.scene=e,this.camera=i,this.overrideMaterial=s,this.clearColor=a,this.clearAlpha=t,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new M}render(e,i,s){const a=e.autoClear;e.autoClear=!1;let t,r;this.overrideMaterial!==null&&(r=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(t=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:s),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(t),this.overrideMaterial!==null&&(this.scene.overrideMaterial=r),e.autoClear=a}}const we={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new M(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class g extends v{constructor(e,i=1,s,a){super(),this.strength=i,this.radius=s,this.threshold=a,this.resolution=e!==void 0?new u(e.x,e.y):new u(256,256),this.clearColor=new M(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let t=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);this.renderTargetBright=new A(t,r,{type:E}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let n=0;n<this.nMips;n++){const c=new A(t,r,{type:E});c.texture.name="UnrealBloomPass.h"+n,c.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(c);const d=new A(t,r,{type:E});d.texture.name="UnrealBloomPass.v"+n,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),t=Math.round(t/2),r=Math.round(r/2)}const l=we;this.highPassUniforms=F.clone(l.uniforms),this.highPassUniforms.luminosityThreshold.value=a,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new m({uniforms:this.highPassUniforms,vertexShader:l.vertexShader,fragmentShader:l.fragmentShader}),this.separableBlurMaterials=[];const o=[6,10,14,18,22];t=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);for(let n=0;n<this.nMips;n++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(o[n])),this.separableBlurMaterials[n].uniforms.invSize.value=new u(1/t,1/r),t=Math.round(t/2),r=Math.round(r/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=i,this.compositeMaterial.uniforms.bloomRadius.value=.1;const x=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=x,this.bloomTintColors=[new b(1,1,1),new b(1,1,1),new b(1,1,1),new b(1,1,1),new b(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=F.clone(B.uniforms),this.blendMaterial=new m({uniforms:this.copyUniforms,vertexShader:B.vertexShader,fragmentShader:B.fragmentShader,premultipliedAlpha:!0,blending:X,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new M,this._oldClearAlpha=1,this._basic=new y,this._fsQuad=new L(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,i){let s=Math.round(e/2),a=Math.round(i/2);this.renderTargetBright.setSize(s,a);for(let t=0;t<this.nMips;t++)this.renderTargetsHorizontal[t].setSize(s,a),this.renderTargetsVertical[t].setSize(s,a),this.separableBlurMaterials[t].uniforms.invSize.value=new u(1/s,1/a),s=Math.round(s/2),a=Math.round(a/2)}render(e,i,s,a,t){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const r=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),t&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=s.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=s.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let l=this.renderTargetBright;for(let o=0;o<this.nMips;o++)this._fsQuad.material=this.separableBlurMaterials[o],this.separableBlurMaterials[o].uniforms.colorTexture.value=l.texture,this.separableBlurMaterials[o].uniforms.direction.value=g.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[o]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[o].uniforms.colorTexture.value=this.renderTargetsHorizontal[o].texture,this.separableBlurMaterials[o].uniforms.direction.value=g.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[o]),e.clear(),this._fsQuad.render(e),l=this.renderTargetsVertical[o];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,t&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(s),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=r}_getSeparableBlurMaterial(e){const i=[],s=e/3;for(let a=0;a<e;a++)i.push(.39894*Math.exp(-.5*a*a/(s*s))/s);return new m({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new u(.5,.5)},direction:{value:new u(.5,.5)},gaussianCoefficients:{value:i}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new m({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}}g.BlurDirectionX=new u(1,0);g.BlurDirectionY=new u(0,1);const R={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class Se extends v{constructor(){super(),this.isOutputPass=!0,this.uniforms=F.clone(R.uniforms),this.material=new Y({name:R.name,uniforms:this.uniforms,vertexShader:R.vertexShader,fragmentShader:R.fragmentShader}),this._fsQuad=new L(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,i,s){this.uniforms.tDiffuse.value=s.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},q.getTransfer(this._outputColorSpace)===J&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Z?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===$?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ee?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===H?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===te?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===ie?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===se&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}function Re(f,e="full"){const i=new ae({canvas:f,antialias:e!=="minimal",powerPreference:e==="minimal"?"low-power":"high-performance"});i.toneMapping=H,i.toneMappingExposure=1.2,i.outputColorSpace=re,i.setPixelRatio(e==="minimal"||e==="reduced"?1:Math.min(window.devicePixelRatio,2)),i.setSize(window.innerWidth,window.innerHeight),e==="full"?(i.shadowMap.enabled=!0,i.shadowMap.type=oe):e==="reduced"&&(i.shadowMap.enabled=!0,i.shadowMap.type=le);const s=new Q;s.background=new M(657930),s.fog=new ne(657930,.04);const a=new he(35,window.innerWidth/window.innerHeight,.1,100);a.position.set(0,.8,5.5);const t=new C(16773341,4);t.position.set(4,6,5),t.castShadow=e==="full",t.shadow.mapSize.set(e==="full"?2048:512,e==="full"?2048:512),t.shadow.camera.near=.5,t.shadow.camera.far=25,t.shadow.camera.left=-4,t.shadow.camera.right=4,t.shadow.camera.top=4,t.shadow.camera.bottom=-4,t.shadow.bias=-5e-4,t.shadow.radius=e==="full"?3:1,s.add(t);const r=new C(12636392,1.5);r.position.set(-5,3,4),s.add(r);const l=new C(16771276,2.5);l.position.set(-1,4,-6),s.add(l);const o=new C(16772829,1.5);o.position.set(0,8,2),o.castShadow=e==="full",s.add(o);const x=new C(15261912,.6);x.position.set(0,-3,2),s.add(x);const n=new ue(15789284,657930,.5);if(s.add(n),s.userData.lights={key:t,fill:r,rim:l,bottom:x,hemi:n,accent:o},e!=="minimal"){const P=new T(new I(30,30),new fe({opacity:e==="full"?.4:.2}));P.rotation.x=-Math.PI/2,P.position.y=-1.8,P.receiveShadow=!0,s.add(P)}const c=new de(i);c.compileEquirectangularShader();const d=new Q,D=new T(new ce(50,32,16),new y({side:pe})),w=document.createElement("canvas");w.width=1024,w.height=512;const h=w.getContext("2d"),p=h.createLinearGradient(0,0,0,512);p.addColorStop(0,"#1a1815"),p.addColorStop(.3,"#2a2520"),p.addColorStop(.5,"#3d3530"),p.addColorStop(.7,"#554d45"),p.addColorStop(1,"#8a7e72"),h.fillStyle=p,h.fillRect(0,0,1024,512);const S=h.createRadialGradient(700,120,20,700,120,200);S.addColorStop(0,"rgba(255,245,225,0.9)"),S.addColorStop(.5,"rgba(255,240,210,0.3)"),S.addColorStop(1,"rgba(255,240,210,0)"),h.fillStyle=S,h.fillRect(0,0,1024,512);const U=h.createRadialGradient(200,180,10,200,180,180);U.addColorStop(0,"rgba(190,210,240,0.4)"),U.addColorStop(1,"rgba(190,210,240,0)"),h.fillStyle=U,h.fillRect(0,0,1024,512);const N=h.createLinearGradient(0,400,0,512);N.addColorStop(0,"rgba(255,240,220,0)"),N.addColorStop(1,"rgba(255,240,220,0.2)"),h.fillStyle=N,h.fillRect(0,0,1024,512),D.material.map=new me(w),D.material.map.mapping=ge,d.add(D);const z=new T(new I(25,10),new y({color:16774624}));z.position.set(5,12,-35),z.lookAt(0,0,0),d.add(z);const O=new T(new I(15,8),new y({color:13689072}));O.position.set(-10,5,-25),O.lookAt(0,0,0),d.add(O),s.environment=c.fromScene(d,0,.1,100).texture,s.environmentIntensity=1.2,c.dispose();let _=null;return e==="full"&&(_=new Te(i),_.addPass(new Me(s,a)),_.addPass(new g(new u(window.innerWidth,window.innerHeight),.35,.6,.85)),_.addPass(new Se)),{renderer:i,scene:s,camera:a,composer:_}}export{Re as createScene};
