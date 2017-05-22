function callPHP(params, url, func = null, args = [])
{
	var httpc = new XMLHttpRequest();
    httpc.open("POST", url, true);
    httpc.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    httpc.onreadystatechange = function() 
		{
			if(httpc.readyState == 4 && httpc.status == 200)
			{
				//console.log("callPHP response: " + url + httpc.responseText);
				if (func != null)
				{
					args.push(httpc.responseText.trim())
					func(args);
				}
			}
		}
	httpc.send(params);  
}

function err(txt)
{
	document.getElementById("err").innerHTML = txt;
	throw txt;
}

class Turtle
{
	constructor(x, y, alfa, farba)
	{
		this.x = x;
		this.y = y;
		this.alfa = alfa;
		this.farba = farba
	}
	
	dopredu(dx)
	{
		var x = this.x + Math.cos(this.alfa * Math.PI / 180) * dx;
		var y = this.y + Math.sin(this.alfa * Math.PI / 180) * dx;
		var c = document.getElementById("canvas");
		var ctx = c.getContext("2d");
		ctx.strokeStyle="#ffffff";
		ctx.moveTo(this.x, 500-this.y);
		ctx.lineTo(x, 500-y);
		ctx.stroke();
		this.x = x;
		this.y = y;
	}
	
	vlavo(alfa)
	{
		this.alfa += alfa;
	}
	
	vpravo(alfa)
	{
		this.alfa -= alfa;
	}
	
	zmaz()
	{
	}
	
	zmenFarbu(farba)
	{
	}

}

var imports = [];

class Context
{
	constructor(k)
	{
		this.k = k;
		this.localMemory = {};
		this.globalMemory = {};
		this.adr = 0;
		this.mem = new Array();
		for (var i = 0 ; i < 200 ; i++)
		{
			this.mem[i] = 0;
		}
		this.funkcie = [];
	}
	poke(code)
	{
		this.mem[this.adr] = code;
		this.adr += 1;
		return this.adr - 1;
	}
}

var vstup;// = "a = 1 kym a <= 100 [dopredu a vpravo 90 a = a + 3]";
var index;// = 0;
var look;
var token = "";
var context = new Context(new Turtle(250, 250, 90, "black"));

//************************************************************************

class Expression
{
	generate()
	{
		
	}
}

class Const// extends Expression
{
	constructor(value)
	{
		this.value = value;
	}
	
	generate()
	{
		context.poke(INSTRUCTION_PUSH);
		context.poke(this.value);
	}
}

class BinaryOperation// extends Expression
{
	constructor(leftOperand, rightOperand)
	{
		this.leftOperand = leftOperand;
		this.rightOperand = rightOperand;
		this.instruction = 0;
	}
	
	generate()
	{
		this.leftOperand.generate();
		this.rightOperand.generate();
		context.poke(this.instruction);
	}
}

class UnaryOperation// extends Expression
{
	constructor(operand)
	{
		this.operand = operand;
	}
}

class Add extends BinaryOperation
{
	constructor(leftOperand, rightOperand)
	{
		super(leftOperand, rightOperand);
		this.instruction = INSTRUCTION_ADD;
	}
}

class Sub extends BinaryOperation
{
	constructor(leftOperand, rightOperand)
	{
		super(leftOperand, rightOperand);
		this.instruction = INSTRUCTION_SUB;
	}
}

class Mul extends BinaryOperation
{
	constructor(leftOperand, rightOperand)
	{
		super(leftOperand, rightOperand);
		this.instruction = INSTRUCTION_MUL;
	}
}

class Div extends BinaryOperation
{
	constructor(leftOperand, rightOperand)
	{
		super(leftOperand, rightOperand);
		this.instruction = INSTRUCTION_DIV;
	}
}

class Lower extends BinaryOperation
{
	constructor(leftOperand, rightOperand)
	{
		super(leftOperand, rightOperand);
		this.instruction = INSTRUCTION_LOWER;
	}
}

class LowerOrEqual extends BinaryOperation
{
	constructor(leftOperand, rightOperand)
	{
		super(leftOperand, rightOperand);
		this.instruction = INSTRUCTION_LOWEREQUAL;
	}
}

class Greater extends BinaryOperation
{
	constructor(leftOperand, rightOperand)
	{
		super(leftOperand, rightOperand);
		this.instruction = INSTRUCTION_GREATER;
	}
}

class GreaterOrEqual extends BinaryOperation
{
	constructor(leftOperand, rightOperand)
	{
		super(leftOperand, rightOperand);
		this.instruction = INSTRUCTION_GREATEREQUAL;
	}
}

class Equal extends BinaryOperation
{
	constructor(leftOperand, rightOperand)
	{
		super(leftOperand, rightOperand);
		this.instruction = INSTRUCTION_EQUAL;
	}
}

class Different extends BinaryOperation
{
	constructor(leftOperand, rightOperand)
	{
		super(leftOperand, rightOperand);
		this.instruction = INSTRUCTION_DIFFERENT;
	}
}

class And extends BinaryOperation
{
	constructor(leftOperand, rightOperand)
	{
		super(leftOperand, rightOperand);
		this.instruction = INSTRUCTION_AND;
	}
}

class Or extends BinaryOperation
{
	constructor(leftOperand, rightOperand)
	{
		super(leftOperand, rightOperand);
		this.instruction = INSTRUCTION_OR;
	}
}

class Minus extends UnaryOperation
{
	constructor(operand)
	{
		super(operand);
		this.instruction = INSTRUCTION_MINUS;
	}
}

class Not extends UnaryOperation
{
	constructor(operand)
	{
		super(operand);
		this.instruction = INSTRUCTION_NOT;
	}
}

class Command
{
	constructor(item)
	{
		this.item = item;
	}
}

class Program extends Command
{	
	generate()
	{
		context.poke(INSTRUCTION_JUMP);
		var zac = context.poke(1);
		this.item.generate();
		context.mem[zac] = context.begin;
	}
}

class Telo extends Command
{	
	generate()
	{
		context.begin = context.adr;
		this.item.generate();
	}
}

class Commands
{
	constructor(items = [])
	{
		this.items = items;
	}
	
	add(item)
	{
		this.items.push(item);
	}
	generate()
	{
		for (var i = 0 ; i < this.items.length ; i += 1)
		{
			this.items[i].generate();
		}
	}
}

class FD extends Command
{
	generate()
	{
		this.item.generate();
		context.poke(INSTRUCTION_FD);
	}
}

class LT extends Command
{
	generate()
	{
		this.item.generate();
		context.poke(INSTRUCTION_LT);
	}
}

class RT extends Command
{
	generate()
	{
		this.item.generate();
		context.poke(INSTRUCTION_RT);
	}
}

class Repeat// extends Command
{
    constructor(count, body)
	{
        this.count = count;
        this.body = body;
	}
	generate()
	{
		this.count.generate(context);
        var opakuj = context.poke(INSTRUCTION_DUPLICATE);
        context.poke(INSTRUCTION_PUSH);
        context.poke(1);
        context.poke(INSTRUCTION_LOWER);
        context.poke(INSTRUCTION_JUMPIFTRUE);
        var pom = context.poke(0);
        this.body.generate(context);
        context.poke(INSTRUCTION_PUSH);
        context.poke(1);
        context.poke(INSTRUCTION_SUB);
        context.poke(INSTRUCTION_JUMP);
        var koniec = context.poke(opakuj);
        context.mem[pom] = koniec + 1;
	}
    	
}

class Import
{
	constructor(pr, f, bin)
	{
		this.pr = pr;
		this.f = f;
		this.bin = bin;
	}
	generate()
	{
		compiler.globalNamespace[this.f].address = context.adr;
		for (var i = 0 ; i < this.bin.length ; i++)
		{
			context.poke(this.bin[i]);
		}
	}
}

class Assign// extends Command
{
    constructor(name, expr)
	{
        this.name = name;
        this.expr = expr;
	}
}

class AssignG extends Assign
{
	generate()
	{
		this.expr.generate();
        context.poke(INSTRUCTION_SETGLOBAL);
        context.poke(this.name.adr);
	}
}

class AssignGG extends Assign
{
	generate()
	{
		context.poke(this.expr.value);
	}
}

class AssignL extends Assign
{
	generate()
	{
		this.expr.generate();
        context.poke(INSTRUCTION_SETLOCAL);
        context.poke(this.name.adr);
	}
}

class Access// extends Expression
{
    constructor(name)
	{
        this.name = name;
	}
}

class AccessG extends Access
{
	generate()
	{
		context.poke(INSTRUCTION_GETGLOBAL);
		context.poke(this.name.adr);
	}
}

class AccessL extends Access
{
	generate()
	{
		context.poke(INSTRUCTION_GETLOCAL)
		context.poke(this.name.adr)
	}
}

class Call //extends Command
{
	constructor(sub, args)
	{
		this.sub = sub;
		this.args = args;
	}
	generate()
	{
		for (var i = 0 ; i < this.args.length ; i += 1)
		{
			this.args[i].generate();
		}
		context.poke(INSTRUCTION_CALL);
		if (this.sub == null)
		{
			err("CHYBA - neznama chyba");
		}
		context.poke(this.sub.address);
	}
}

class Print //extends Command
{
	constructor(expr)
	{
		this.expr = expr;
	}
	generate()
	{
		this.expr.generate(context);
		context.poke(INSTRUCTION_PRINT);
	}
}

class While// extends Command
{
    constructor(test, body)
	{
        this.test = test;
        this.body = body;
	}
    generate()
	{
        var pom = context.adr;
        this.test.generate();
        context.poke(INSTRUCTION_JUMPIFFALSE);
        var pom2 = context.poke(0);
        this.body.generate();
        context.poke(INSTRUCTION_JUMP);
        context.poke(pom);
        context.mem[pom2] = context.adr;
	}
}

class If// extends Command
{
    constructor(test, body, elseBody = null)
	{
        this.test = test;
        this.body = body;
		this.elseBody = elseBody;
	}
    generate()
	{
        this.test.generate();
        context.poke(INSTRUCTION_JUMPIFFALSE);
        var pom = context.poke(0);
        this.body.generate();
        if (this.elseBody != null)
		{
            this.elseBody.generate();
		}
        context.mem[pom] = context.adr;
	}
}

class Variable
{
	constructor(name, adr)
	{
		this.name = name;
		this.adr = adr;
	}
}

class LocalVariable extends Variable
{
	get()
	{
		return context.localMemory[this.adr];
	}
	set(value)
	{
		context.localMemory[this.adr] = value;
	}
}

class GlobalVariable extends Variable
{
	get()
	{
		return context.globalMemory[this.adr];
	}
	set(value)
	{
		context.globalMemory[this.adr] = value;
	}
}

class Subroutine
{
	constructor(name, namespace = {}, body = new Commands(), address = 0)
	{
        this.name = name;
        this.namespace = namespace;
        this.body = body;
        this.address = address;
        this.f = false;
	}
	generate()
	{
		var funkcia = {};//
		funkcia.meno = this.name;//
        this.address = context.adr;
		funkcia.zac = this.address;//
        var paramCount = 0;
        for (var i in this.namespace)
		{
            if (this.namespace[i].adr < 0)
			{
                context.poke(INSTRUCTION_PUSH);
                context.poke(0);
			}
            else
			{
                paramCount += 1;
			}
		}
        this.body.generate();
        if (this.f)
		{
            //context.poke(context.INSTRUCTION_RETURNRET)
		}
        else
		{
            context.poke(INSTRUCTION_RETURN);
		}
        funkcia.kon = context.poke(paramCount);
		context.funkcie.push(funkcia)//
	}
}

//****************************************************************

function next()
{
	if (index >= vstup.length)
	{
		look = String.fromCharCode(0);
	}
	else
	{
		look = vstup.charAt(index);
		index += 1;
	}
}

function ord(c)
{
	return c.charCodeAt(0);
}

const STATE_END =                0;
const STATE_START =              1;
const STATE_NUMBER =             2;
const STATE_WORD =               3;
const STATE_SYMBOL =             4;
const STATE_SYMBOLLESS =         5;
const STATE_SYMBOLLESSEQUAL =    6;
const STATE_SYMBOLDIFFERENT =    7;
const STATE_SYMBOLGREATER =      8;
const STATE_SYMBOLGREATEREQUAL = 9;
const STATE_SYMBOLDOT =          10;
const STATE_SYMBOLDOTS =         11;
const STATE_SYMBOLINTERVAL =     12;       

var state = 0;
var last_state = 0;

var change = new Array();
for (var i = 0 ; i < 13 ; i++)
{
	change[i] = new Array();
	for (var j = 0 ; j < 256 ; j++)
	{
		change[i][j] = 0;
	}
}
change[STATE_START][ord(' ')] = STATE_START;
change[STATE_START][ord('\n')] = STATE_START;
for (var i = 48 ; i < 57+1 ; i++)//0..9
{
	change[STATE_START][i] = STATE_NUMBER;
	change[STATE_NUMBER][i] = STATE_NUMBER;
}
for (var i = 65 ; i < 90+1 ; i++)//#A..Z
{
	change[STATE_START][i] = STATE_WORD;
	change[STATE_WORD][i] = STATE_WORD;
}
for (var i = 97 ; i < 122+1 ; i++)//#a..z
{
	change[STATE_START][i] = STATE_WORD;
	change[STATE_WORD][i] = STATE_WORD;
}
var symbols = ['[', ']', '(', ')', '+', '-', '*', '/', '=', ',', '?', ':'];
for (var i = 0 ; i < symbols.length ; i++)
{
	change[STATE_START][ord(symbols[i])] = STATE_SYMBOL;
}
change[STATE_START][ord('<')] = STATE_SYMBOLLESS;//#symboly < <= <>
change[STATE_SYMBOLLESS][ord('=')] = STATE_SYMBOLLESSEQUAL;
change[STATE_SYMBOLLESS][ord('>')] = STATE_SYMBOLDIFFERENT;
change[STATE_START][ord('>')] = STATE_SYMBOLGREATER;//#symboly > >=
change[STATE_SYMBOLGREATER][ord('=')] = STATE_SYMBOLGREATEREQUAL;
change[STATE_START][ord('.')] = STATE_SYMBOLDOT;//#bodka a interval
change[STATE_SYMBOLDOT][ord('.')] = STATE_SYMBOLDOTS;
change[STATE_SYMBOLDOTS][ord('.')] = STATE_SYMBOLINTERVAL;
function scan()
{
	token = "";
	state = change[STATE_START][ord(look)];
	last_state = change[STATE_START][ord(look)];
	while (state != STATE_END)
	{
		if (state != STATE_START)
		{
			token += look;
		}
		next();
		last_state = state;
		state = change[state][ord(look)];
	}
}

const INSTRUCTION_FD = 				1;
const INSTRUCTION_LT = 				2;
const INSTRUCTION_RT = 				3;
const INSTRUCTION_SET = 			4;
const INSTRUCTION_LOOP = 			5;
const INSTRUCTION_JUMP = 			6;
const INSTRUCTION_PUSH = 			7;
const INSTRUCTION_REMOVE = 			8;
const INSTRUCTION_DUPLICATE = 		9;
const INSTRUCTION_MINUS = 			10;
const INSTRUCTION_ADD = 			11;
const INSTRUCTION_SUB = 			12;
const INSTRUCTION_MUL = 			13;
const INSTRUCTION_DIV = 			14;
const INSTRUCTION_LOWER = 			15;
const INSTRUCTION_LOWEREQUAL = 		16;
const INSTRUCTION_GREATER = 		17;
const INSTRUCTION_GREATEREQUAL = 	18;
const INSTRUCTION_EQUAL = 			19;
const INSTRUCTION_DIFFERENT = 		20;
const INSTRUCTION_NOT = 			21;
const INSTRUCTION_AND = 			22;
const INSTRUCTION_OR = 				23;
const INSTRUCTION_JUMPIFTRUE = 		24;
const INSTRUCTION_JUMPIFFALSE = 	25;
const INSTRUCTION_SETGLOBAL = 		26;
const INSTRUCTION_GETGLOBAL = 		27;
const INSTRUCTION_SETLOCAL = 		28;
const INSTRUCTION_GETLOCAL = 		29;
const INSTRUCTION_CALL = 			30;
const INSTRUCTION_RETURN = 			31;

function isEmpty(obj)
{
	return Object.keys(obj).length === 0 && obj.constructor === Object;
}

class Compiler
{
	constructor()
	{
		this.localNamespace = {};
		this.globalNamespace = {};
		this.globalVariableAdr = 2;
		this.table = new Array();
		for (var i = 0 ; i < 32 ; i++)
		{
			this.table[i] = this.compile_other;
		}
		this.table[this.hash("definuj")] = this.compile_define;
        this.table[this.hash("vypis")] = this.compile_print;
        this.table[this.hash("dopredu")] = this.compile_forward;
        this.table[this.hash("vlavo")] = this.compile_left;
        this.table[this.hash("vpravo")] = this.compile_right;
        this.table[this.hash("opakuj")] = this.compile_repeat;
        this.table[this.hash("kym")] = this.compile_while;
        this.table[this.hash("ak")] = this.compile_if;
        this.table[this.hash("begin")] = this.compile_begin;
        this.table[this.hash("return")] = this.compile_return;
		this.table[this.hash("import")] = this.compile_import;
	}
	hash(txt)
	{
		var vysl = 0;
        for (var i = 0 ; i < txt.length ; i++)
		{
            if (i % 2 == 0)
			{
                vysl += (8 * ord(txt[i]));
			}
            else
			{
                vysl -= ord(txt[i]);
			}
		}
        return vysl % 32;
	}
	operand()
	{
		if (last_state == STATE_NUMBER)
		{
			var result = new Const(parseInt(token));
			scan();
		}
		else if (last_state == STATE_WORD)
		{
			if (!isEmpty(this.localNamespace) && this.localNamespace.hasOwnProperty(token))
			{
				result = new AccessL(this.localNamespace[token]);
			}
			else if (this.globalNamespace.hasOwnProperty(token))
			{
				var id = this.globalNamespace[token];
				//kod pre CallF
				var result = new AccessG(id);			
			}
			else
			{
				err("CHYBA - neznama premenna");
			}
			scan()
		}
		else if (token == '(')
		{
			scan();
			var result = this.expr();
			if (token != ')')
			{
				err("CHYBA - zatvorky");
			}
			else
			{
				scan();
			}
		}
		else
		{
			err("CHYBA - cislo alebo nazov premennej " + token);
		}
		return result;
	}
	minus()
	{
		if (token != '-')
		{
			return this.operand();
		}
		scan();
		return new Minus(this.operand());
	}
	muldiv()
	{
		var result = this.minus();
		while (true)
		{
			if (token == '*')
			{
				scan();
				result = new Mul(result, this.minus());
			}
			else if (token == '/')
			{
				scan();
				result = new Div(result, this.minus());
			}
			else
			{
				return result;
			}
		}
	}
	addsub()
	{
		var result = this.muldiv();
		while (true)
		{
			if (token == '+')
			{
				scan();
				result = new Add(result, this.muldiv());
			}
			else if (token == '/')
			{
				scan();
				result = new Sub(result, this.muldiv());
			}
			else
			{
				return result;
			}
		}
	}
	compare()
	{
		var result2 = this.addsub();
		var result = new Const(true);
		var flag = false;
		var result_next;
		while (true)
		{
			if (token == '<')
			{
				scan();
				result_next = this.addsub();
				result = new And(result, new Lower(result2, result_next));
				flag = true;
			}
			else if (token == '<=')
			{
				scan();
				result_next = this.addsub();
				result = new And(result, new LowerOrEqual(result2, result_next));
				flag = true;
			}
			else if (token == '>')
			{
				scan();
				result_next = this.addsub();
				result = new And(result, new Greater(result2, result_next));
				flag = true;
			}
			else if (token == '>=')
			{
				scan();
				result_next = this.addsub();
				result = new And(result, new GreaterOrEqual(result2, result_next));
				flag = true;
			}
			else if (token == '!=')
			{
				scan();
				result_next = this.addsub();
				result = new And(result, new Different(result2, result_next));
				flag = true;
			}
			else if (token == '==')
			{
				scan();
				result_next = this.addsub();
				result = new And(result, new Equal(result2, result_next));
				flag = true;
			}
			else
			{
				if (flag)
				{
					return result;
				}
				return result2;
			}
			result2 = result_next;
		}
	}
	not()
	{
		if (token != 'not')
		{
			return this.compare();
		}
		scan();
		return new Not(compare());
	}
	and()
	{
		var result = this.not();
		while (true)
		{
			if (token == 'and')
			{
				scan();
				result = new And(result, not());
			}
			else
			{
				return result;
			}
		}
	}
	expr() //or
	{
		var result = this.and();
		while (true)
		{
			if (token == 'and')
			{
				scan();
				result = new Or(result, and());
			}
			else
			{
				return result;
			}
		}
	}
	compile()
	{
		var result = new Commands();
		while (last_state == STATE_WORD)
		{
			if (token.length < 2)
			{
				this.compile_other(result);
			}
			else
			{
				this.table[this.hash(token)](result);
			}
		}
		return result;
	}
	compile_other(result)
	{
        var name = token;
        scan();
        if (token == '(')
		{
            var args = [];
            scan();
            while (token != "" && token != ")")
			{
                args.push(compiler.expr());
                if (token == ",")
				{
					scan();
				}
			}
            if (token != ")")
			{
				err("CHYBA - neznamy prikaz");
			}
            scan();
            result.add(new Call(compiler.globalNamespace[name], args));
		}
        else if (token == '=')
		{
            scan();
            if (!isEmpty(compiler.localNamespace) && compiler.localNamespace.hasOwnProperty(name))
			{
                var variable = compiler.localNamespace[name];
                result.add(new AssignL(variable, compiler.expr()));
			}
            else if (compiler.globalNamespace.hasOwnProperty(name))
			{
                var variable = compiler.globalNamespace[name];
                result.add(new AssignG(variable, compiler.expr()));
			}
            else if (!isEmpty(compiler.localNamespace))
			{
                var variable = new LocalVariable(name, Object.keys(compiler.localNamespace).length);
                localNamespace[name] = variable;
                result.add(new AssignL(variable, compiler.expr()));
			}
            else
			{
                var variable = new GlobalVariable(name, compiler.globalVariableAdr);
                compiler.globalNamespace[name] = variable;
                compiler.globalVariableAdr += 1;
                result.add(new AssignGG(variable, compiler.expr()));
			}
		}
        else
		{
            //result = compiler.expr();
			err("CHYBA - nespravny zapis");
		}
	}
	compile_define(result)
	{
        if (token != 'definuj')
		{
            compiler.compile_other(result);
		}
        else
		{
            scan();
            var sub = new Subroutine(token);
            compiler.globalNamespace[token] = sub;
            scan();
            if (token != '(')
			{
				err('CHYBA - ocakaval som ( parametre');
			}
            scan();
            while (last_state == STATE_WORD)
			{
                sub.namespace[token] = new LocalVariable(token, 2+Object.keys(sub.namespace).length);
                scan();
                if (token == ',')
				{
                    scan();
				}
			}
            if (token != ')')
			{
				err('CHYBA - ocakaval som )');
			}
            scan();
            if (token != '[')
			{
				err('CHYBA - ocakaval som [ telo podprogramu');
			}
            scan();
            compiler.localNamespace = sub.namespace;
            sub.body = compiler.compile();
            compiler.localNamespace = {};
            if (token != "]")
			{
				err('CHYBA - ocakaval som koniec tela podprogramu ]');
			}
            scan();
            //if (type(sub.body.items[-1]) == Return:
               // sub.f = True
            result.add(sub);
		}
	}
    compile_print(result)
	{
        if (token != 'vypis')
		{
            compiler.compile_other(result);
		}
        else
		{
            scan();
            result.add(new Print(compiler.expr()));
		}
	}
    compile_forward(result)
	{
        if (token != 'dopredu')
		{
            compiler.compile_other(result);
		}
        else
		{
            scan();
            result.add(new FD(compiler.expr()));
		}
	}
    compile_left(result)
	{
        if (token != 'vlavo')
		{
            compiler.compile_other(result);
		}
        else
		{
            scan();
            result.add(new LT(compiler.expr()));
		}
	}
    compile_right(result)
	{
        if (token != 'vpravo')
		{
            compiler.compile_other(result);
		}
        else
		{
            scan();
            result.add(new RT(compiler.expr()));
		}
	}
    compile_repeat(result)
	{
        if (token != 'opakuj')
		{
            compiler.compile_other(result);
		}
        else
		{
            scan();
            var count = compiler.expr();
            if (token == '[')
			{
                scan();
                var body = compiler.compile();
                if (token == ']')
				{
                    scan();
				}
				else
				{
					err('CHYBA - koniec cyklu ]');
				}
                result.add(new Repeat(count, body));
			}
			else
			{
				err('CHYBA - telo cyklu [');
			}
		}
	}
    compile_while(result)
	{
        if (token != 'kym')
		{
            compiler.compile_other(result);
		}
        else
		{
            scan();
            var test = compiler.expr();
            if (token != '[')
			{
				err('CHYBA - telo cyklu [');
			}
            scan();
            result.add(new While(test, compiler.compile()));
            if (token != ']')
			{
				err('CHYBA - koniec cyklu ]');
			}
            scan();
		}
	}
    compile_if(result)
	{
        if (token != 'ak')
		{
            compiler.compile_other(result);
		}
        else
		{
            scan();
            var test = compiler.expr();
            if (token != '[')
			{
				err('CHYBA - telo ifu [');
			}
            scan();
            var body = compiler.compile();
            if (token != ']')
			{
				err('CHYBA - koniec ifu ]', token, this.A.vstup.index);
			}
            scan();
            if (token == '[')
			{
                scan();
                var elseBody = compiler.compile();
                result.add(new If(test, body, elseBody));
                if (token != ']')
				{
					err('CHYBA - koniec else ]');
				}
                scan();
			}
            else
			{
                result.add(new If(test, body));
			}
		}
	}
    compile_begin(result)
	{
        if (token != "begin")
		{
            compiler.compile_other(result);
		}
        else
		{
            scan();
            result.add(new Telo(compiler.compile()));
		}
	}
    compile_return(result)
	{
    //    if token != "return":
     //       this.compile_other(result)
    //    else:
    //        scan()
    //        result.add(Return(this.expr()))
	}
	compile_import(result)
	{
        if (token != "import")
		{
            compiler.compile_other(result);
		}
        else
		{
            scan();
			var pr = token;
			scan();
			var f = token;
			compiler.globalNamespace[f] = {name:f, address:0};
			scan();
			var imp = new Import(pr, f, []);
			imports.push(imp)
			result.add(imp);			
		}
	}
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


class CPU
{
	constructor()
	{
		this.pc = 0;
		this.pz = 200;
		this.pf = 200;
		this.terminated = false;
	}	
	execute()
	{
		if (context.mem[this.pc] == INSTRUCTION_FD)
		{
            this.pc = this.pc + 1;
            context.k.dopredu(context.mem[this.pz]);
            this.pz = this.pz + 1;
		}
        else if (context.mem[this.pc] == INSTRUCTION_LT)
		{
            this.pc = this.pc + 1;
            context.k.vlavo(context.mem[this.pz]);
            this.pz = this.pz + 1;
		}
        else if (context.mem[this.pc] == INSTRUCTION_RT)
		{
            this.pc = this.pc + 1;
            context.k.vpravo(context.mem[this.pz]);
            this.pz = this.pz + 1;
		}
        else if (context.mem[this.pc] == INSTRUCTION_SET)
		{
            this.pc = this.pc + 1;
            index = context.mem[this.pc];
            this.pc = this.pc + 1;
            context.mem[index] = context.mem[this.pc];
            this.pc = this.pc + 1;
		}
        else if (context.mem[this.pc] == INSTRUCTION_LOOP)
		{
            this.pc = this.pc + 1;
            index = context.mem[this.pc];
            this.pc = this.pc + 1;
            context.mem[index] = context.mem[index] - 1;
            if (context.mem[index] <= 0)
			{
                this.pc = this.pc + 1;
			}
            else
			{
                this.pc = context.mem[this.pc];
			}
		}
        else if (context.mem[this.pc] == INSTRUCTION_JUMP)
		{
            this.pc = this.pc + 1;
            this.pc = context.mem[this.pc];
		}
        else if (context.mem[this.pc] == INSTRUCTION_PUSH)
		{
            this.pc = this.pc + 1;
            this.pz = this.pz - 1;
            context.mem[this.pz] = context.mem[this.pc];
            this.pc = this.pc + 1;
		}
        else if (context.mem[this.pc] == INSTRUCTION_REMOVE)
		{
            this.pc = this.pc + 1;
            this.pz = this.pz + 1;
		}
        else if (context.mem[this.pc] == INSTRUCTION_DUPLICATE)
		{
            this.pc = this.pc + 1;
            this.pz = this.pz - 1;
            context.mem[this.pz] = context.mem[this.pz + 1];
		}
        else if (context.mem[this.pc] == INSTRUCTION_MINUS)
		{
            this.pc = this.pc + 1;
            context.mem[this.pz] = -context.mem[this.pz];
		}
        else if (context.mem[this.pc] == INSTRUCTION_ADD)
		{
            this.pc = this.pc + 1;
            context.mem[this.pz + 1] = context.mem[this.pz + 1] + context.mem[this.pz];
            this.pz = this.pz + 1;
		}
        else if (context.mem[this.pc] == INSTRUCTION_SUB)
		{
            this.pc = this.pc + 1;
            context.mem[this.pz + 1] = context.mem[this.pz + 1] - context.mem[this.pz];
            this.pz = this.pz + 1;
		}
        else if (context.mem[this.pc] == INSTRUCTION_MUL)
		{
            this.pc = this.pc + 1;
            context.mem[this.pz + 1] = context.mem[this.pz + 1] * context.mem[this.pz];
            this.pz = this.pz + 1;
		}
        else if (context.mem[this.pc] == INSTRUCTION_DIV)
		{
            this.pc = this.pc + 1;
            context.mem[this.pz + 1] = context.mem[this.pz + 1] / context.mem[this.pz];//DIV
            this.pz = this.pz + 1;
		}
        else if (context.mem[this.pc] == INSTRUCTION_LOWER)
		{
            this.pc = this.pc + 1;
            context.mem[this.pz + 1] = context.mem[this.pz + 1] < context.mem[this.pz];
            this.pz = this.pz + 1;
		}
        else if (context.mem[this.pc] == INSTRUCTION_LOWEREQUAL)
		{
            this.pc = this.pc + 1;
            context.mem[this.pz + 1] = context.mem[this.pz + 1] <= context.mem[this.pz];
            this.pz = this.pz + 1;
		}
        else if (context.mem[this.pc] == INSTRUCTION_GREATER)
		{
            this.pc = this.pc + 1;
            context.mem[this.pz + 1] = context.mem[this.pz + 1] > context.mem[this.pz];
            this.pz = this.pz + 1;
		}
        else if (context.mem[this.pc] == INSTRUCTION_GREATEREQUAL)
		{
            this.pc = this.pc + 1;
            context.mem[this.pz + 1] = context.mem[this.pz + 1] >= context.mem[this.pz];
            this.pz = this.pz + 1;
		}
        else if (context.mem[this.pc] == INSTRUCTION_EQUAL)
		{
            this.pc = this.pc + 1;
            context.mem[this.pz + 1] = context.mem[this.pz + 1] == context.mem[this.pz];
            this.pz = this.pz + 1;
		}
        else if (context.mem[this.pc] == INSTRUCTION_DIFFERENT)
		{
            this.pc = this.pc + 1;
            context.mem[this.pz + 1] = context.mem[this.pz + 1] != context.mem[this.pz];
            this.pz = this.pz + 1;
		}
        else if (context.mem[this.pc] == INSTRUCTION_NOT)
		{
            this.pc = this.pc + 1;
            context.mem[this.pz] = !context.mem[this.pz];
		}
        else if (context.mem[this.pc] == INSTRUCTION_AND)
		{
            this.pc = this.pc + 1;
            context.mem[this.pz + 1] = context.mem[this.pz + 1] && context.mem[this.pz];
            this.pz = this.pz + 1;
		}
        else if (context.mem[this.pc] == INSTRUCTION_OR)
		{
            this.pc = this.pc + 1;
            context.mem[this.pz + 1] = context.mem[this.pz + 1] || context.mem[this.pz];
            this.pz = this.pz + 1;
		}
        else if (context.mem[this.pc] == INSTRUCTION_JUMPIFTRUE)
		{
            this.pc = this.pc + 1;
            var adr = context.mem[this.pc];
            this.pc = this.pc + 1;
            if (context.mem[this.pz])
			{
                this.pc = adr;
			}
            this.pz += 1;
		}
        else if (context.mem[this.pc] == INSTRUCTION_JUMPIFFALSE)
		{
            this.pc = this.pc + 1;
            var adr = context.mem[this.pc];
            this.pc = this.pc + 1;
            if (!context.mem[this.pz])
			{
                this.pc = adr;
			}
            this.pz += 1;
		}
        else if (context.mem[this.pc] == INSTRUCTION_SETGLOBAL)
		{
            this.pc = this.pc + 1;
            context.mem[context.mem[this.pc]] = context.mem[this.pz];
            this.pz += 1;
            this.pc += 1;
		}
        else if (context.mem[this.pc] == INSTRUCTION_GETGLOBAL)
		{
            this.pc = this.pc + 1;
            this.pz -= 1;
            context.mem[this.pz] = context.mem[context.mem[this.pc]];
            this.pc += 1;
		}
        else if (context.mem[this.pc] == INSTRUCTION_SETLOCAL)
		{
            this.pc = this.pc + 1;
            context.mem[this.pf + context.mem[this.pc]] = context.mem[this.pz];
            this.pz += 1;
            this.pc += 1;
		}
        else if (context.mem[this.pc] == INSTRUCTION_GETLOCAL)
		{
            this.pc = this.pc + 1;
            this.pz -= 1;
            context.mem[this.pz] = context.mem[this.pf + context.mem[this.pc]];
            this.pc += 1;
		}
        else if (context.mem[this.pc] == INSTRUCTION_CALL)
		{
            this.pc = this.pc + 1;
            this.pz -= 1;
            context.mem[this.pz] = this.pc + 1;
            this.pz -= 1;
            context.mem[this.pz] = this.pf;
            this.pf = this.pz;
            this.pc = context.mem[this.pc];
		}
        else if (context.mem[this.pc] == INSTRUCTION_RETURN)
		{
            this.pc = this.pc + 1;
            this.pz = this.pf + 2 + context.mem[this.pc];
            this.pc = context.mem[this.pf + 1];
            this.pf = context.mem[this.pf];
		}
        //else if context.mem[this.pc] == INSTRUCTION_IFO:
       //     this.pc += 1
        //    el = context.mem[this.pz]
       //     th = context.mem[this.pz + 1]
       //     test = context.mem[this.pz + 2]
        //    this.pz += 2
        //    if test:
        //        context.mem[this.pz] = th
       //     else:
       //         context.mem[this.pz] = el
      //  else if context.mem[this.pc] == INSTRUCTION_RETURNRET:
      //      this.pc = this.pc + 1
       //     q = False
       //     if this.pz < 100:
       //         h = context.mem[this.pz]
      //          q = True
      //      this.pz = this.pf + 2 + context.mem[this.pc]
      //      this.pc = context.mem[this.pf + 1]
      //      this.pf = context.mem[this.pf]
       //     if q:
       //         this.pz -= 1
       //         context.mem[this.pz] = h
        else
		{
            this.terminated = true;
		}
	}
	res()
	{
        this.pc = 0;
        this.pz = 200;
        this.pf = 200;
        this.terminated = false;
	}
	spusti()
	{
        this.res();
        while (this.terminated != true)
		{
            this.execute();
		}
		document.getElementById("err").innerHTML = "";
	}
}

var compiler = new Compiler();
var cpu = new CPU();

function kresliProjekt(i)
{
	zmaz();
	vstup = i;
	index = 0;
	next();
	scan();
	var program = new Program(compiler.compile());
	if (imports.length == 0)
	{
		program.generate();
		go();
	}
	else
	{
		handleImport(program, 0);
	}
}

function handleImport(program, imp)
{
	callPHP("pr="+imports[imp].pr+"&f="+imports[imp].f, "ajax.php",
			function(args)
			{
				if (args[2] != 0)
				{
					var pole = args[2].split(',');
					for (var i = 0 ; i < pole.length ; i++)
					{
						args[1].bin.push((parseInt(pole[i])));
					}
					if (imp + 1 == imports.length)
					{
						program.generate();
						go();
					}
				}
				else
				{
					err("CHYBA - imoport " + args[1].pr + " " + args[1].f);
				}
			}, [context, imports[imp]]);
	if (imp < imports.length - 1)
	{
		handleImport(program, imp+1);
	}
}

function go()
{
	var bin = "";
	for (var i = 0 ; i < context.adr ; i++)
	{
		bin += context.mem[i] + ",";
	}
	bin = bin.substring(0, bin.length - 1);
	var fs = "";
	for (var i = 0 ; i < context.funkcie.length ; i++)
	{
		fs += context.funkcie[i].meno + ",";
		fs += context.funkcie[i].zac + ",";
		fs += context.funkcie[i].kon + ";";
	}
	fs = fs.substring(0, fs.length - 1);
	callPHP("bin="+bin+"&fs="+fs,"ajax.php");
	cpu.spusti();
}

function kresli(i)
{
	vstup = "begin " + i;
	index = 0;
	next();
	scan();
	var program = new Program(compiler.compile());
	program.generate();
	cpu.spusti();
}

function zmaz()
{
	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	ctx.clearRect(0, 0, c.width, c.height);
	var tmp = c.width;
	c.width = 1;
	c.width = tmp;	
	context = new Context(new Turtle(250, 250, 90, "black"), {});
}