cc.Class({
    extends: cc.Component,

    properties: {
        size: cc.size(0, 0),
        mouseJoint: true
    },

    // use this for initialization
    onLoad: function() {
        { // 開啟物力系統
            let physicsManager = cc.director.getPhysicsManager();
            physicsManager.enabled = true;

            // physicsManager.gravity = cc.v2();

            // cc.director.getPhysicsManager().debugDrawFlags =
            //     cc.PhysicsManager.DrawBits.e_aabbBit |
            //     cc.PhysicsManager.DrawBits.e_jointBit |
            //     cc.PhysicsManager.DrawBits.e_shapeBit;

            // cc.director.getPhysicsManager().debugDrawFlags =
            //     // 0;
            //     // cc.PhysicsManager.DrawBits.e_aabbBit |
            //     cc.PhysicsManager.DrawBits.e_jointBit |
            //     cc.PhysicsManager.DrawBits.e_shapeBit;
        }

        { // 開啟碰撞系統
            var manager = cc.director.getCollisionManager();
            manager.enabled = true;
            manager.enabledDebugDraw = true;
            manager.enabledDrawBoundingBox = true;
        }

        let width = this.size.width || this.node.width;
        let height = this.size.height || this.node.height;

        let node = new cc.Node();

        let body = node.addComponent(cc.RigidBody);
        body.type = cc.RigidBodyType.Static;

        if (this.mouseJoint) {
            // add mouse joint
            let joint = node.addComponent(cc.MouseJoint);
            joint.mouseRegion = this.node;
        }

        this._addBound(node, 0, height / 2, width, 20);
        this._addBound(node, 0, -height / 2, width, 20);
        this._addBound(node, -width / 2, 0, 20, height);
        this._addBound(node, width / 2, 0, 20, height);

        node.parent = this.node;
    },

    _addBound(node, x, y, width, height) {
        let collider = node.addComponent(cc.PhysicsBoxCollider);
        collider.offset.x = x;
        collider.offset.y = y;
        collider.size.width = width;
        collider.size.height = height;
    }
});